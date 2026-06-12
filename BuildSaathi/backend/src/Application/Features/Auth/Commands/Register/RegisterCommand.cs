using MediatR;

namespace BuildSaathi.Application.Features.Auth.Commands.Register;

public record RegisterCommand(
    string Name,
    string Email,
    string Password,
    string Phone,
    string CompanyName,
    string City,
    string State
) : IRequest<AuthResponse>;

public record AuthResponse(
    string AccessToken,
    string RefreshToken,
    int ExpiresIn,
    ContractorDto Contractor
);

public record ContractorDto(
    Guid Id,
    string Name,
    string Email,
    string Phone,
    string CompanyName,
    string City,
    string State
);
