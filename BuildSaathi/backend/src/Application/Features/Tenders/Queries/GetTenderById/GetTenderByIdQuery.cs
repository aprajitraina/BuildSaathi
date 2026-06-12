using BuildSaathi.Application.Features.Tenders.Queries.SearchTenders;
using MediatR;

namespace BuildSaathi.Application.Features.Tenders.Queries.GetTenderById;

public record GetTenderByIdQuery(Guid TenderId) : IRequest<TenderDetailDto>;

public record TenderDetailDto(
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
    decimal? DocumentFee,
    DateTime PublishedDate,
    DateTime SubmissionDeadline,
    DateTime? OpeningDate,
    string? SourceUrl,
    string SourcePortal,
    bool IsSaved,
    bool HasSummary,
    IEnumerable<string> Tags
);
