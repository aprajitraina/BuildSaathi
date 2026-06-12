using BuildSaathi.Application.Features.Settings.Queries.GetSettingsProfile;
using MediatR;

namespace BuildSaathi.Application.Features.Settings.Commands.UpdateSettingsProfile;

public record UpdateSettingsProfileCommand(
    string Name,
    string Phone,
    string CompanyName,
    string? GstNumber,
    string? PanNumber,
    string City,
    string State,
    string? Address,
    IReadOnlyCollection<string>? PreferredCategories
) : IRequest<SettingsProfileDto>;
