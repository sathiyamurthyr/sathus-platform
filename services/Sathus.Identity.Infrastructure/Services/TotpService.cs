namespace Sathus.Identity.Infrastructure.Services;

using System.Security.Cryptography;
using System.Text;
using Sathus.Identity.Application.Interfaces;

public class TotpService : ITotpService
{
    private const int TotpLength = 6;
    private const int TotpTimeStep = 30;

    public string GenerateSecret()
    {
        var secretBytes = new byte[20];
        RandomNumberGenerator.Fill(secretBytes);
        return Base32Encoding.ToString(secretBytes);
    }

    public string GetQrCodeUri(string secret, string account, string issuer)
    {
        var uri = new StringBuilder()
            .Append("otpauth://totp/")
            .Append(Uri.EscapeDataString(issuer))
            .Append(':')
            .Append(Uri.EscapeDataString(account))
            .Append("?secret=")
            .Append(secret)
            .Append("&issuer=")
            .Append(Uri.EscapeDataString(issuer))
            .Append("&algorithm=SHA1")
            .Append("&digits=6")
            .Append("&period=30")
            .ToString();

        return uri;
    }

    public bool VerifyCode(string secret, string code)
    {
        if (string.IsNullOrWhiteSpace(secret) || string.IsNullOrWhiteSpace(code))
        {
            return false;
        }

        if (code.Length != TotpLength || !code.All(char.IsDigit))
        {
            return false;
        }

        var secretBytes = Base32Encoding.ToBytes(secret);
        if (secretBytes is null || secretBytes.Length == 0)
        {
            return false;
        }

        var currentCounter = GetCurrentCounter();
        var providedCode = int.Parse(code);

        for (var i = -1; i <= 1; i++)
        {
            if (GenerateCode(secretBytes, currentCounter + i) == providedCode)
            {
                return true;
            }
        }

        return false;
    }

    private static long GetCurrentCounter()
    {
        var elapsedSeconds = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        return elapsedSeconds / TotpTimeStep;
    }

    private static int GenerateCode(byte[] secret, long counter)
    {
        var counterBytes = BitConverter.GetBytes(counter);
        if (BitConverter.IsLittleEndian)
        {
            Array.Reverse(counterBytes);
        }

        using var hmac = new HMACSHA1(secret);
        var hash = hmac.ComputeHash(counterBytes);

        var offset = hash[^1] & 0x0F;
        var binaryCode = ((hash[offset] & 0x7F) << 24) |
                         ((hash[offset + 1] & 0xFF) << 16) |
                         ((hash[offset + 2] & 0xFF) << 8) |
                         (hash[offset + 3] & 0xFF);

        return binaryCode % 1000000;
    }

    private static class Base32Encoding
    {
        private const string Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

        public static string ToString(byte[] data)
        {
            var output = new StringBuilder();
            for (var i = 0; i < data.Length;)
            {
                var b = data[i++];
                var bitsLeft = 8;
                var value = b;

                while (bitsLeft > 0)
                {
                    var index = value >> 3;
                    output.Append(Alphabet[index]);
                    value = (byte)((value << 5) & 0xFF);
                    bitsLeft -= 5;

                    if (bitsLeft < 5 && i < data.Length)
                    {
                        value |= (byte)(data[i++] >> (8 - bitsLeft));
                    }
                }
            }

            return output.ToString();
        }

        public static byte[]? ToBytes(string input)
        {
            input = input.Replace(" ", "").Replace("-", "").ToUpperInvariant();
            if (input.Length == 0)
            {
                return null;
            }

            var output = new List<byte>();
            int bits = 0;
            int value = 0;

            foreach (var c in input)
            {
                var index = Alphabet.IndexOf(c);
                if (index < 0)
                {
                    return null;
                }

                value = (value << 5) | index;
                bits += 5;

                if (bits >= 8)
                {
                    output.Add((byte)(value >> (bits - 8)));
                    bits -= 8;
                    value &= (1 << bits) - 1;
                }
            }

            return output.ToArray();
        }
    }
}
