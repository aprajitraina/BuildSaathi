using MediatR;

namespace BuildSaathi.Application.Features.Tenders.Queries.SearchTenders;

public record SearchTendersQuery(
    string? Query = null,
    string? State = null,
    string? Category = null,
    decimal? MinValue = null,
    decimal? MaxValue = null,
    DateTime? DeadlineBefore = null,
    int PageNumber = 1,
    int PageSize = 20
) : IRequest<SearchTendersResponse>;

public record SearchTendersResponse(
    IEnumerable<TenderDto> Items,
    int TotalCount,
    int PageNumber,
    int PageSize,
    int TotalPages,
    bool HasPreviousPage,
    bool HasNextPage
);

public record TenderDto(
    Guid Id,
    string Title,
    string ReferenceNumber,
    string Department,
    string Organization,
    string State,
    string? District,
    string Category,
    decimal EstimatedValue,
    decimal? EmdAmount,
    DateTime PublishedDate,
    DateTime SubmissionDeadline,
    string SourcePortal,
    bool IsSaved,
    bool HasSummary
);
