using BuildSaathi.Application.Features.Auth.Commands.Register;
using MediatR;

namespace BuildSaathi.Application.Features.Auth.Commands.Login;

public record LoginCommand(string Email, string Password) : IRequest<AuthResponse>;
