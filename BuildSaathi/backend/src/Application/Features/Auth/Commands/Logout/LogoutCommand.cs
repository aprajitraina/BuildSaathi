using MediatR;

namespace BuildSaathi.Application.Features.Auth.Commands.Logout;

public record LogoutCommand : IRequest<Unit>;
