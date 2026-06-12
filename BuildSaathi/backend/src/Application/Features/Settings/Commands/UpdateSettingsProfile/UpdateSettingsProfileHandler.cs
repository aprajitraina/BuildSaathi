using BuildSaathi.Application.Common.Exceptions;
using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Application.Features.Settings.Queries.GetSettingsProfile;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.Settings.Commands.UpdateSettingsProfile;

public class UpdateSettingsProfileHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser,
    IActivityLogger activityLogger) : IRequestHandler<UpdateSettingsProfileCommand, SettingsProfileDto>
{
    public async Task<SettingsProfileDto> Handle(UpdateSettingsProfileCommand request, CancellationToken cancellationToken)
    {
        var contractor = await db.Contractors
            .FirstOrDefaultAsync(c => c.Id == currentUser.ContractorId, cancellationToken)
            ?? throw new NotFoundException("Contractor", currentUser.ContractorId);

        contractor.UpdateProfile(
            request.Name,
            request.Phone,
            request.CompanyName,
            request.GstNumber,
            request.PanNumber,
            request.City,
            request.State,
            request.Address,
            request.PreferredCategories);

        activityLogger.Log(
            eventType: "settings_updated",
            description: "Contractor profile updated",
            entityType: "contractor",
            entityId: contractor.Id);

        await db.SaveChangesAsync(cancellationToken);

        return SettingsProfileMapper.ToDto(contractor);
    }
}
