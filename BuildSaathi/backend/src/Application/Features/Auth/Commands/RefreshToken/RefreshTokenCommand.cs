using BuildSaathi.Application.Features.Auth.Commands.Register;
using MediatR;

namespace BuildSaathi.Application.Features.Auth.Commands.RefreshToken;

public record RefreshTokenCommand(string RefreshToken) : IRequest<AuthResponse>;
