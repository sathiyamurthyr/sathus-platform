namespace Sathus.MediaRelations.Application.DTOs;

/// <summary>Result of validating an asset's references against the DAM Foundation.</summary>
public sealed record ReferenceValidationResponse(
    Guid AssetId,
    bool AssetExists,
    int TotalReferences,
    int ValidReferences,
    int BrokenReferences,
    int RestoredReferences,
    IReadOnlyList<MediaReferenceResponse> AffectedReferences);
