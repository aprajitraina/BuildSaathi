using MediatR;

namespace BuildSaathi.Application.Features.Settings.Queries.GetSettingsProfile;

public record GetSettingsProfileQuery : IRequest<SettingsProfileDto>;

public record SettingsProfileDto(
    Guid ContractorId,
    string Name,
    string Email,
    string Phone,
    string CompanyName,
    string? GstNumber,
    string? PanNumber,
    string City,
    string State,
    string? Address,
    IReadOnlyCollection<string> PreferredCategories
);
