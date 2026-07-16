using System.Collections.Generic;
using Sathus.Storage.Domain.Enums;
using Sathus.Storage.Domain.Results;

namespace Sathus.Storage.Infrastructure.Configuration;

public class StorageOptions
{
    public string DefaultProvider { get; set; } = StorageProviderType.Local.ToString();
    public Dictionary<string, ProviderOptions> Providers { get; set; } = new();
    public StorageLocation? DefaultLocation { get; set; }
}
