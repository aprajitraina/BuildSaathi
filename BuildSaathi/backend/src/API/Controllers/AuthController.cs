using BuildSaathi.Application.Features.Auth.Commands.Login;
using BuildSaathi.Application.Features.Auth.Commands.Logout;
using BuildSaathi.Application.Features.Auth.Commands.RefreshToken;
using BuildSaathi.Application.Features.Auth.Commands.Register;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace BuildSaathi.API.Controllers;

/// <summary>
/// Authentication endpoints: register, login, token refresh, and logout.
/// Logout requires a valid access token.
/// </summary>
[ApiController]
[Route("api/v1/auth")]
public class AuthController(ISender mediator) : ControllerBase
{
    private const string RefreshCookieName = "bs_refresh_token";

    private void SetRefreshCookie(string refreshToken)
    {
        var options = new CookieOptions
        {
            HttpOnly = true,
            Secure = Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddDays(7),
            Path = "/",
        };
        Response.Cookies.Append(RefreshCookieName, refreshToken, options);
    }

    private void ClearRefreshCookie()
    {
        Response.Cookies.Delete(RefreshCookieName, new CookieOptions
        {
            HttpOnly = true,
            Secure = Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Path = "/",
        });
    }

    [EnableRateLimiting("AuthPolicy")]
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterCommand command, CancellationToken ct)
    {
        var result = await mediator.Send(command, ct);
        SetRefreshCookie(result.RefreshToken);
        return CreatedAtAction(nameof(Register), result);
    }

    [EnableRateLimiting("AuthPolicy")]
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginCommand command, CancellationToken ct)
    {
        var result = await mediator.Send(command, ct);
        SetRefreshCookie(result.RefreshToken);
        return Ok(result);
    }

    [EnableRateLimiting("AuthPolicy")]
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest? request, CancellationToken ct)
    {
        var refreshToken = request?.RefreshToken ?? Request.Cookies[RefreshCookieName];
        if (string.IsNullOrWhiteSpace(refreshToken))
            throw new UnauthorizedAccessException("Refresh token is required.");

        var command = new RefreshTokenCommand(refreshToken);
        var result = await mediator.Send(command, ct);
        SetRefreshCookie(result.RefreshToken);
        return Ok(result);
    }

    [Authorize]
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Logout(CancellationToken ct)
    {
        await mediator.Send(new LogoutCommand(), ct);
        ClearRefreshCookie();
        return NoContent();
    }

    [HttpGet("me")]
    [Authorize]
    public IActionResult GetMe()
    {
        // Returns current user info from JWT claims — no DB call needed
        return Ok(new
        {
            UserId = User.FindFirst("userId")?.Value,
            ContractorId = User.FindFirst("contractorId")?.Value,
            Name = User.FindFirst("contractorName")?.Value,
            Email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value,
        });
    }
}

public record RefreshTokenRequest(string? RefreshToken);
