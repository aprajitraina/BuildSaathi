using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Entities;
using BuildSaathi.Domain.Interfaces;
using MediatR;

namespace BuildSaathi.Application.Features.BOQ.Commands.CreateBOQ;

public class CreateBOQHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser,
    IActivityLogger activityLogger) : IRequestHandler<CreateBOQCommand, BOQResponse>
{
    public async Task<BOQResponse> Handle(CreateBOQCommand request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;

        var boq = Domain.Entities.BOQ.Create(
            contractorId, request.Title, request.State,
            request.WorkCategory, request.TenderId,
            request.OverheadPercent, request.ContingencyPercent);

        db.BOQs.Add(boq);
        activityLogger.Log("boq_created", $"BOQ created: {boq.Title}", "boq", boq.Id);
        await db.SaveChangesAsync(cancellationToken);

        return MapToResponse(boq);
    }

    internal static BOQResponse MapToResponse(Domain.Entities.BOQ boq) => new(
        boq.Id, boq.Title, boq.TenderId, boq.ProjectId, boq.State, boq.WorkCategory,
        boq.Status.ToString(), boq.OverheadPercent, boq.ContingencyPercent,
        boq.TotalEstimatedCost,
        boq.LineItems.Select(li => new LineItemResponse(
            li.Id, li.Description, li.Unit, li.Quantity, li.UnitRate,
            li.Amount, li.DsrCode, li.Category, li.Remarks, li.SortOrder)),
        boq.CreatedAt,
        boq.UpdatedAt
    );
}
