using Sathus.Forms.Application.Workflow;
using Sathus.Forms.Domain.Enums;

namespace Sathus.Forms.Application.Interfaces;

/// <summary>Dispatches workflow notification intents to the appropriate channel.</summary>
public interface INotificationDispatcher
{
    Task DispatchAsync(NotificationIntent intent, CancellationToken cancellationToken = default);
}

/// <summary>Posts an automation payload to an external webhook / API callback.</summary>
public interface IWebhookDispatcher
{
    Task PostAsync(string url, object payload, CancellationToken cancellationToken = default);
}

/// <summary>Stores submission file attachments via the Enterprise DAM.</summary>
public interface IDamService
{
    Task<DamAssetReference> StoreAsync(string fileName, string? contentType, long size, System.IO.Stream content, CancellationToken cancellationToken = default);
}

/// <summary>The reference returned after storing an asset in the DAM.</summary>
public sealed record DamAssetReference(string AssetId, string? Url, long Size);

/// <summary>Validates that a Reference / Repeater field points to an existing resource.</summary>
public interface IReferenceValidator
{
    Task<ReferenceValidationResult> ValidateAsync(ReferenceKind kind, Guid referenceId, CancellationToken cancellationToken = default);
}

/// <summary>Result of validating a reference to another Sathus resource.</summary>
public sealed record ReferenceValidationResult(bool Exists, bool IsBroken, Guid? ResolvedId);
