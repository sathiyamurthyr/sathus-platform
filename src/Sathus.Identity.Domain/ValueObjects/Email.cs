namespace Sathus.Identity.Domain.ValueObjects;

public readonly record struct Email(string Value)
{
    public static Email Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Email cannot be empty.", nameof(value));

        value = value.Trim();
        if (value.Length > 256) throw new ArgumentException("Email exceeds maximum length of 256.", nameof(value));
        if (!value.Contains('@') || !value.Contains('.'))
            throw new ArgumentException("Invalid email format.", nameof(value));

        return new Email(value);
    }

    public static implicit operator string(Email email) => email.Value;
}
