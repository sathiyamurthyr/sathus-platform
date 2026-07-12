using Microsoft.Extensions.Configuration;

namespace Sathus.Storage.Infrastructure.Configuration;

public class LocalStorageOptions
{
    public string RootPath { get; set; } = string.Empty;
    public string PublicUrlBase { get; set; } = string.Empty;
    public bool CreateDirectories { get; set; } = true;

    public static LocalStorageOptions FromConfiguration(IConfiguration configuration)
    {
        var options = new LocalStorageOptions();
        configuration.Bind(options);
        return options;
    }
}
