using BuildSaathi.Application.Common.Exceptions;
using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Application.Features.BOQ.Commands.CreateBOQ;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.BOQ.Queries.GetBOQ;

public class GetBOQListHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser) : IRequestHandler<GetBOQListQuery, IEnumerable<BOQResponse>>
{
    public async Task<IEnumerable<BOQResponse>> Handle(GetBOQListQuery request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;

        var boqs = await db.BOQs
            .Include(b => b.LineItems)
            .Where(b => b.ContractorId == contractorId)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync(cancellationToken);

        return boqs.Select(CreateBOQHandler.MapToResponse);
    }
}

public class GetBOQByIdHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser) : IRequestHandler<GetBOQByIdQuery, BOQResponse>
{
    public async Task<BOQResponse> Handle(GetBOQByIdQuery request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;

        var boq = await db.BOQs
            .Include(b => b.LineItems.Where(li => !li.IsDeleted))
            .FirstOrDefaultAsync(b => b.Id == request.BOQId && b.ContractorId == contractorId, cancellationToken)
            ?? throw new NotFoundException("BOQ", request.BOQId);

        return CreateBOQHandler.MapToResponse(boq);
    }
}
