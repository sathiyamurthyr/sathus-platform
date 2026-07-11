namespace Sathus.Identity.Application.DTOs;

public sealed record RegisterUserRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName);
