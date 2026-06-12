using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Interfaces;
using BuildSaathi.Modules.Estimation.Application.Abstractions;
using BuildSaathi.Modules.Estimation.Application.Common;
using BuildSaathi.Modules.Estimation.Application.Contracts;
using BuildSaathi.Modules.Estimation.Application.Mapping;
using BuildSaathi.Modules.Estimation.Domain;
using BuildSaathi.Modules.Estimation.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildSaathi.Modules.Estimation.Application.Commands.UploadEstimateFile;

public class UploadEstimateFileHandler(
    ICurrentUserService currentUser,
    IWordDocumentParser wordParser,
    IEstimateRepository estimates,
    IApplicationDbContext db,
    ILogger<UploadEstimateFileHandler> logger) : IRequestHandler<UploadEstimateFileCommand, EstimationApiEnvelope<EstimateDetailDto>>
{
    public async Task<EstimationApiEnvelope<EstimateDetailDto>> Handle(UploadEstimateFileCommand request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;
        if (contractorId == Guid.Empty)
            return EstimationApiEnvelope<EstimateDetailDto>.Fail("Contractor context is required.");

        if (!request.FileName.EndsWith(".docx", StringComparison.OrdinalIgnoreCase))
            return EstimationApiEnvelope<EstimateDetailDto>.Fail("Only .docx Word files are supported.");

        IReadOnlyList<ParsedEstimateRow> rows;
        try
        {
            rows = await wordParser.ParseEstimateTablesAsync(request.FileContent, cancellationToken);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to parse Word estimate {FileName}", request.FileName);
            return EstimationApiEnvelope<EstimateDetailDto>.Fail("Could not parse the Word document. Ensure it contains a BOQ table.");
        }

        if (rows.Count == 0)
            return EstimationApiEnvelope<EstimateDetailDto>.Fail("No line items were found in the document.");

        var estimate = Estimate.Create(
            contractorId,
            EstimateSourceType.Upload,
            ProjectType.Building,
            request.EstimateType,
            areaSqFt: 0,
            request.Location,
            floors: null,
            finishType: null,
            request.TenderId);

        var order = 0;
        foreach (var row in rows)
        {
            estimate.AddItem(EstimateItem.Create(
                estimate.Id,
                row.ItemName,
                row.Quantity,
                row.Unit,
                row.Rate,
                row.Amount,
                order++));
        }

        estimates.Add(estimate);
        await db.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Created estimate {EstimateId} from upload {FileName}", estimate.Id, request.FileName);

        var reloaded = await estimates.GetDetailedAsync(estimate.Id, contractorId, cancellationToken);
        return EstimationApiEnvelope<EstimateDetailDto>.Ok(EstimateDtoMapper.ToDetailDto(reloaded!));
    }
}
