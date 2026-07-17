using System.Text;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Logging;
using Sathus.Media.Domain.ValueObjects;
using Sathus.Storage.Domain.Interfaces;
using Sathus.Storage.Domain.ValueObjects;
using Sathus.Upload.Application.Interfaces;
using Sathus.Upload.Domain.Entities;
using Sathus.Upload.Domain.Exceptions;

namespace Sathus.Upload.Infrastructure.Services;

public class DefaultUploadValidator : IUploadValidator
{
    private static readonly string[] AllowedVideoExtensions = { "mp4", "mov", "avi", "mkv", "webm" };
    private static readonly string[] AllowedImageExtensions = { "jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico" };
    private static readonly string[] AllowedDocumentExtensions = { "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv" };
    private static readonly string[] AllowedAudioExtensions = { "mp3", "wav", "flac", "aac", "ogg", "m4a" };

    private static readonly Regex InvalidPathChars = new(@"[<>:""|?*\x00-\x1F]", RegexOptions.Compiled);
    private static readonly Regex PathTraversal = new(@"\.\.[/\\]", RegexOptions.Compiled);

    private readonly IStorageProviderFactory _storageFactory;
    private readonly ILogger<DefaultUploadValidator> _logger;

    public DefaultUploadValidator(IStorageProviderFactory storageFactory, ILogger<DefaultUploadValidator> logger)
    {
        _storageFactory = storageFactory;
        _logger = logger;
    }

    public async Task ValidateAsync(UploadSession session, CancellationToken cancellationToken = default)
    {
        ValidateFileName(session.FileName.Value);
        ValidateExtension(session.FileExtension.Value, session.MimeType.Value);
        ValidateMimeType(session.MimeType.Value, session.FileExtension.Value);
        ValidateFileSize(session.FileSize.Bytes, session.MimeType.Value);
        await ValidateDuplicateAsync(session, cancellationToken);
        ValidateFolderRules(session);
    }

    private void ValidateFileName(string fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
            throw new ArgumentException("File name is required.");

        if (fileName.Length > 512)
            throw new ArgumentException("File name exceeds maximum length of 512.");

        if (InvalidPathChars.IsMatch(fileName))
            throw new ArgumentException("File name contains invalid characters.");

        if (PathTraversal.IsMatch(fileName) || fileName.Contains(".."))
            throw new ArgumentException("File name contains path traversal sequences.");
    }

    private void ValidateExtension(string extension, string mimeType)
    {
        var allAllowed = AllowedImageExtensions
            .Concat(AllowedVideoExtensions)
            .Concat(AllowedAudioExtensions)
            .Concat(AllowedDocumentExtensions)
            .Select(e => e.ToLowerInvariant())
            .ToHashSet();

        if (!allAllowed.Contains(extension.ToLowerInvariant()))
            throw new ArgumentException($"File extension '{extension}' is not allowed.");
    }

    private void ValidateMimeType(string mimeType, string extension)
    {
        if (string.IsNullOrWhiteSpace(mimeType))
            throw new ArgumentException("MIME type is required.");

        var ext = extension.ToLowerInvariant();
        var type = mimeType.Split('/')[0].ToLowerInvariant();

        var isValid = ext switch
        {
            "jpg" or "jpeg" or "png" or "gif" or "webp" or "svg" or "bmp" or "ico" => type == "image",
            "mp4" or "mov" or "avi" or "mkv" or "webm" => type == "video",
            "mp3" or "wav" or "flac" or "aac" or "ogg" or "m4a" => type == "audio",
            "pdf" or "doc" or "docx" or "xls" or "xlsx" or "ppt" or "pptx" or "txt" or "csv" => type == "application" || type == "text",
            _ => true
        };

        if (!isValid)
            throw new ArgumentException($"MIME type '{mimeType}' does not match extension '{extension}'.");
    }

    private void ValidateFileSize(long bytes, string mimeType)
    {
        var maxSize = mimeType.StartsWith("video/") ? 100L * 1024 * 1024 * 1024 : 10L * 1024 * 1024 * 1024;
        if (bytes > maxSize)
            throw new ArgumentException($"File size exceeds maximum allowed size of {maxSize} bytes.");
    }

    private async Task ValidateDuplicateAsync(UploadSession session, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(session.Checksum?.Value))
            return;

        try
        {
            var provider = _storageFactory.Resolve();
            var key = $"uploads/{session.Checksum.Value}";
            var exists = await provider.ExistsAsync(key, cancellationToken);
            if (exists)
                throw new DuplicateUploadException(session.Checksum.Value);
        }
        catch (Exception ex) when (ex is not DuplicateUploadException)
        {
            _logger.LogWarning(ex, "Failed to check duplicate for checksum {Checksum}", session.Checksum.Value);
        }
    }

    private void ValidateFolderRules(UploadSession session)
    {
        if (!session.IsFolder)
            return;

        if (string.IsNullOrWhiteSpace(session.FolderPath))
            throw new ArgumentException("Folder path is required for folder uploads.");

        if (session.FolderPath.Length > 2048)
            throw new ArgumentException("Folder path exceeds maximum length of 2048.");

        if (InvalidPathChars.IsMatch(session.FolderPath))
            throw new ArgumentException("Folder path contains invalid characters.");

        if (PathTraversal.IsMatch(session.FolderPath))
            throw new ArgumentException("Folder path contains path traversal sequences.");
    }
}
