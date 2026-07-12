using Microsoft.Extensions.Configuration;

namespace Sathus.Storage.Infrastructure.Configuration;

public class BackblazeOptions
{
    public string ApplicationKeyId { get; set; } = string.Empty;
    public string ApplicationKey { get; set; } = string.Empty;
    public string BucketId { get; set; } = string.Empty;
    public string? BucketName { get; set; }
    public string? Endpoint { get; set; }

    public static BackblazeOptions FromConfiguration(IConfiguration configuration)
    {
        var options = new BackblazeOptions();
        configuration.Bind(options);
        return options;
    }
}
