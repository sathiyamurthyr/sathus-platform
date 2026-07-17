using MediatR;
using Sathus.Content.Application.DTOs;

namespace Sathus.Content.Application.Commands.CreateMediaAsset;

public sealed record CreateMediaAssetCommand(
    string Filename,
    string OriginalName,
    string MimeType,
    long Size,
    string Url,
    string? AltText = null)
    : IRequest<MediaAssetResponse>;
