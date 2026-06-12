using BuildSaathi.Domain.Entities;
using BuildSaathi.Application.Features.Settings.Queries.GetSettingsProfile;

namespace BuildSaathi.Application.Features.Settings;

internal static class SettingsProfileMapper
{
    public static SettingsProfileDto ToDto(Contractor contractor) =>
        new(
            contractor.Id,
            contractor.Name,
            contractor.Email,
            contractor.Phone,
            contractor.CompanyName,
            contractor.GstNumber,
            contractor.PanNumber,
            contractor.City,
            contractor.State,
            contractor.Address,
            contractor.PreferredCategories);
}
