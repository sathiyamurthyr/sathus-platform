using Microsoft.Extensions.Configuration;

namespace Sathus.Storage.Infrastructure.Configuration;

public class MinIoOptions
{
    public string Endpoint { get; set; } = string.Empty;
    public string AccessKey { get; set; } = string.Empty;
    public string SecretKey { get; set; } = string.Empty;
    public bool UseSsl { get; set; } = true;
    public string? Region { get; set; }

    public static MinIoOptions FromConfiguration(IConfiguration configuration)
    {
        var options = new MinIoOptions();
        configuration.Bind(options);
        return options;
    }
}
