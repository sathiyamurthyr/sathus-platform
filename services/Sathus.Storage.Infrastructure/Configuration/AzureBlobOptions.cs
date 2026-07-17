using Microsoft.Extensions.Configuration;

namespace Sathus.Storage.Infrastructure.Configuration;

public class AzureBlobOptions
{
    public string ConnectionString { get; set; } = string.Empty;
    public string ContainerName { get; set; } = string.Empty;
    public string? BlobEndpoint { get; set; }

    public static AzureBlobOptions FromConfiguration(IConfiguration configuration)
    {
        var options = new AzureBlobOptions();
        configuration.Bind(options);
        return options;
    }
}
