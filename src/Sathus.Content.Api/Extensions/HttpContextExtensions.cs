using System;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Sathus.Content.Api.Extensions;

internal static class HttpContextExtensions
{
    public static Guid? GetUserId(this ClaimsPrincipal principal)
    {
        if (principal is null)
        {
            return null;
        }

        var claim = principal.FindFirst(ClaimTypes.NameIdentifier)
                   ?? principal.FindFirst(JwtRegisteredClaimNames.Sub);

        if (claim is null)
        {
            return null;
        }

        return Guid.TryParse(claim.Value, out var id) ? id : null;
    }

    public static Guid? GetUserId(this HttpContext context) => context.User.GetUserId();
}
