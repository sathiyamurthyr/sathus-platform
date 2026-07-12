using Microsoft.Extensions.Configuration;
using Sathus.Storage.Domain.Enums;

namespace Sathus.Storage.Infrastructure.Configuration;

public class ProviderOptions
{
    public string Name { get; set; } = string.Empty;
    public StorageProviderType Type { get; set; }
    public bool IsDefault { get; set; } = false;
    public string? BucketName { get; set; }
    public string? ContainerName { get; set; }
    public string? Region { get; set; }
    public string? Endpoint { get; set; }
    public Dictionary<string, string> Settings { get; set; } = new();

    public static ProviderOptions FromConfiguration(IConfiguration configuration)
    {
        var options = new ProviderOptions();
        configuration.Bind(options);
        if (!string.IsNullOrWhiteSpace(configuration["Type"]))
            options.Type = Enum.Parse<StorageProviderType>(configuration["Type"]!);
        return options;
    }
}
