namespace Sathus.Identity.Application.DTOs;

public sealed record ErrorResponse(string Code, string Message, IReadOnlyList<string>? Details = null);
