using System;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Http;

namespace Sathus.Navigation.Api.Extensions;

internal static class HttpContextExtensions
{
    public static Guid? GetUserId(this ClaimsPrincipal? principal)
    {
        if (principal is null)
        {
            return null;
        }

        var claim = principal.FindFirst(ClaimTypes.NameIdentifier)
                   ?? principal.FindFirst(JwtRegisteredClaimNames.Sub);

        return claim is null ? null : Guid.TryParse(claim.Value, out var id) ? id : null;
    }

    public static Guid? GetUserId(this HttpContext context) => context.User.GetUserId();
}
