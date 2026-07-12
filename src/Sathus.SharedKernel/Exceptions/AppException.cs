namespace Sathus.SharedKernel.Exceptions;

/// <summary>
/// Base exception for application/domain errors that should surface as problem details.
/// </summary>
public class AppException : Exception
{
    public AppException(string message) : base(message)
    {
    }

    public AppException(string message, Exception innerException) : base(message, innerException)
    {
    }
}
