using BuildSaathi.Application.Common.Exceptions;
using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.Settings.Queries.GetSettingsProfile;

public class GetSettingsProfileHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser) : IRequestHandler<GetSettingsProfileQuery, SettingsProfileDto>
{
    public async Task<SettingsProfileDto> Handle(GetSettingsProfileQuery request, CancellationToken cancellationToken)
    {
        var contractor = await db.Contractors
            .FirstOrDefaultAsync(c => c.Id == currentUser.ContractorId, cancellationToken)
            ?? throw new NotFoundException("Contractor", currentUser.ContractorId);

        return SettingsProfileMapper.ToDto(contractor);
    }
}
