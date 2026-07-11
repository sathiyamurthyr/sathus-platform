namespace Sathus.Identity.Domain.ValueObjects;

public readonly record struct TokenValue(string Value)
{
    public static TokenValue Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Token cannot be empty.", nameof(value));

        if (value.Length > 512) throw new ArgumentException("Token exceeds maximum length of 512.", nameof(value));

        return new TokenValue(value);
    }

    public static implicit operator string(TokenValue token) => token.Value;
}
