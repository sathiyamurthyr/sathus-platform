namespace Sathus.Identity.Application.Exceptions;

public sealed class AccountLockedException : AppException
{
    public DateTimeOffset? LockoutEnd { get; }

    public AccountLockedException(string message, DateTimeOffset? lockoutEnd = null) : base(message)
    {
        LockoutEnd = lockoutEnd;
    }
}
