namespace BuildSaathi.Modules.Estimation.Application.Abstractions;

public record ParsedEstimateRow(string ItemName, decimal Quantity, string Unit, decimal Rate, decimal Amount);

public interface IWordDocumentParser
{
    Task<IReadOnlyList<ParsedEstimateRow>> ParseEstimateTablesAsync(Stream docxStream, CancellationToken cancellationToken = default);
}
