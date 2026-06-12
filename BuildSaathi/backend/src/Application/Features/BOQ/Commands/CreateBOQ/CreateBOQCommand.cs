using MediatR;

namespace BuildSaathi.Application.Features.BOQ.Commands.CreateBOQ;

public record CreateBOQCommand(
    string Title,
    string State,
    string WorkCategory,
    Guid? TenderId = null,
    Guid? ProjectId = null,
    decimal OverheadPercent = 15m,
    decimal ContingencyPercent = 5m
) : IRequest<BOQResponse>;

public record BOQResponse(
    Guid Id,
    string Title,
    Guid? TenderId,
    Guid? ProjectId,
    string State,
    string WorkCategory,
    string Status,
    decimal OverheadPercent,
    decimal ContingencyPercent,
    decimal TotalEstimatedCost,
    IEnumerable<LineItemResponse> LineItems,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record LineItemResponse(
    Guid Id,
    string Description,
    string Unit,
    decimal Quantity,
    decimal UnitRate,
    decimal Amount,
    string? DsrCode,
    string Category,
    string? Remarks,
    int SortOrder
);
