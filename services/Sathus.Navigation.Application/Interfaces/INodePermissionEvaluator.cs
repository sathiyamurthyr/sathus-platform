using System.Threading;
using System.Threading.Tasks;
using Sathus.Navigation.Domain.Entities;
using Sathus.Navigation.Domain.Enums;

namespace Sathus.Navigation.Application.Interfaces;

/// <summary>
/// Authorization context for evaluating node-level permission rules.
/// </summary>
public sealed class AuthorizationContext
{
    public bool IsAuthenticated { get; init; }

    public IReadOnlySet<string> Permissions { get; init; } = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

    public IReadOnlySet<string> Roles { get; init; } = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
}

/// <summary>
/// Evaluates <see cref="NavigationPermission"/> rules against a principal. Integrated with the
/// Sathus Permission Engine for existence checks via <see cref="IPermissionCatalog"/>.
/// </summary>
public interface INodePermissionEvaluator
{
    Task<bool> IsAuthorized(IEnumerable<NavigationPermission> rules, AuthorizationContext context, CancellationToken cancellationToken = default);
}
