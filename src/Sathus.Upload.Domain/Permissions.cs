namespace Sathus.Upload.Domain;

public static class UploadPermissions
{
    public const string Upload = "media.upload";
    public const string UploadLarge = "media.upload.large";
    public const string UploadFolder = "media.upload.folder";
    public const string Cancel = "media.cancel";

    public static IReadOnlyList<string> All { get; } = new[]
    {
        Upload,
        UploadLarge,
        UploadFolder,
        Cancel
    };
}
