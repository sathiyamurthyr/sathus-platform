using Microsoft.Extensions.Configuration;

namespace Sathus.Storage.Infrastructure.Configuration;

public class S3Options
{
    public string AccessKey { get; set; } = string.Empty;
    public string SecretKey { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public string? BucketName { get; set; }
    public bool ForcePathStyle { get; set; } = false;

    public static S3Options FromConfiguration(IConfiguration configuration)
    {
        var options = new S3Options();
        configuration.Bind(options);
        return options;
    }
}
