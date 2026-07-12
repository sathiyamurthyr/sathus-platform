namespace Sathus.Storage.Domain.Exceptions;

public class InvalidStorageConfigurationException : StorageException
{
    public InvalidStorageConfigurationException(string provider, string detail) : base($"Invalid configuration for provider '{provider}': {detail}")
    {
        ErrorCode = "storage.invalid_configuration";
    }
}
