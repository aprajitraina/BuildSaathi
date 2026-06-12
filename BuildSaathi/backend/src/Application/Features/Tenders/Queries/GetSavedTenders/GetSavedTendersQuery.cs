using BuildSaathi.Application.Features.Tenders.Queries.SearchTenders;
using MediatR;

namespace BuildSaathi.Application.Features.Tenders.Queries.GetSavedTenders;

public record GetSavedTendersQuery : IRequest<IEnumerable<TenderDto>>;
