using BuildSaathi.Modules.Estimation.Application.Abstractions;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.Extensions.Logging;

namespace BuildSaathi.Modules.Estimation.Infrastructure.Parsers;

public class WordParserService(ILogger<WordParserService> logger) : IWordDocumentParser
{
    public async Task<IReadOnlyList<ParsedEstimateRow>> ParseEstimateTablesAsync(Stream docxStream, CancellationToken cancellationToken = default)
    {
        if (docxStream.CanSeek)
            docxStream.Position = 0;

        return await Task.Run(() => ParseInternal(docxStream), cancellationToken);
    }

    private List<ParsedEstimateRow> ParseInternal(Stream stream)
    {
        using var doc = WordprocessingDocument.Open(stream, false);
        var body = doc.MainDocumentPart?.Document?.Body;
        if (body is null) return [];

        var rows = new List<ParsedEstimateRow>();
        foreach (var table in body.Descendants<Table>())
        {
            var parsed = ParseTable(table);
            rows.AddRange(parsed);
        }

        logger.LogInformation("Word parser extracted {Count} BOQ rows.", rows.Count);
        return rows;
    }

    private static List<ParsedEstimateRow> ParseTable(Table table)
    {
        var result = new List<ParsedEstimateRow>();
        var tableRows = table.Elements<TableRow>().ToList();
        if (tableRows.Count < 2) return result;

        var headerCells = GetCellTexts(tableRows[0]);
        var map = MapColumns(headerCells);
        if (map.NameIdx < 0)
            return result;

        for (var r = 1; r < tableRows.Count; r++)
        {
            var cells = GetCellTexts(tableRows[r]);
            if (cells.Count == 0) continue;

            var name = GetCell(cells, map.NameIdx);
            if (string.IsNullOrWhiteSpace(name) || name.Equals("Total", StringComparison.OrdinalIgnoreCase))
                continue;

            var qty = map.QtyIdx >= 0 ? ParseDecimal(GetCell(cells, map.QtyIdx)) : 0;
            var unit = map.UnitIdx >= 0 ? GetCell(cells, map.UnitIdx) : "";
            var rate = map.RateIdx >= 0 ? ParseDecimal(GetCell(cells, map.RateIdx)) : 0;
            var amount = map.AmtIdx >= 0 ? ParseDecimal(GetCell(cells, map.AmtIdx)) : Math.Round(qty * rate, 2, MidpointRounding.AwayFromZero);

            if (qty == 0 && rate == 0 && amount == 0) continue;

            if (string.IsNullOrWhiteSpace(unit)) unit = "Nos";

            result.Add(new ParsedEstimateRow(name, qty, unit, rate, amount));
        }

        return result;
    }

    private static ColumnMap MapColumns(IReadOnlyList<string> headerCells)
    {
        var map = new ColumnMap();
        for (var i = 0; i < headerCells.Count; i++)
        {
            var h = headerCells[i].ToLowerInvariant();
            if (map.NameIdx < 0 && (h.Contains("item") || h.Contains("description") || h.Contains("particular")))
                map.NameIdx = i;
            if (map.QtyIdx < 0 && (h.Contains("qty") || h.Contains("quant")))
                map.QtyIdx = i;
            if (map.UnitIdx < 0 && h.Contains("unit"))
                map.UnitIdx = i;
            if (map.RateIdx < 0 && (h.Contains("rate") || h.Contains("price")))
                map.RateIdx = i;
            if (map.AmtIdx < 0 && (h.Contains("amount") || h.Contains("amt") || h.Contains("total")))
                map.AmtIdx = i;
        }

        if (map.NameIdx < 0 && headerCells.Count >= 1) map.NameIdx = 0;
        if (map.QtyIdx < 0 && headerCells.Count >= 2) map.QtyIdx = 1;
        if (map.UnitIdx < 0 && headerCells.Count >= 3) map.UnitIdx = 2;
        if (map.RateIdx < 0 && headerCells.Count >= 4) map.RateIdx = 3;
        if (map.AmtIdx < 0 && headerCells.Count >= 5) map.AmtIdx = 4;

        return map;
    }

    private static IReadOnlyList<string> GetCellTexts(TableRow row) =>
        row.Elements<TableCell>().Select(c => string.Join(" ", c.Descendants<Text>().Select(t => t.Text))).ToList();

    private static string GetCell(IReadOnlyList<string> cells, int idx) =>
        idx >= 0 && idx < cells.Count ? cells[idx].Trim() : "";

    private static decimal ParseDecimal(string raw)
    {
        if (string.IsNullOrWhiteSpace(raw)) return 0;
        var cleaned = new string(raw.Where(ch => char.IsDigit(ch) || ch is '.' or '-' or ',').ToArray());
        cleaned = cleaned.Replace(",", "");
        return decimal.TryParse(cleaned, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var v)
            ? v
            : 0;
    }

    private sealed class ColumnMap
    {
        public int NameIdx = -1;
        public int QtyIdx = -1;
        public int UnitIdx = -1;
        public int RateIdx = -1;
        public int AmtIdx = -1;
    }
}
