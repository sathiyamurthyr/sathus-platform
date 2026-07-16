using Sathus.Media.Domain.ValueObjects;
using Sathus.Processing.Domain;
using Sathus.Processing.Domain.ValueObjects;

namespace Sathus.Processing.Domain.Interfaces;

/// <summary>
/// Strategy that processes a single asset category (image, video, document, ...).
/// New processors plug in via DI without modifying the pipeline or registry.
/// </summary>
public interface IAssetProcessor
{
    string Name { get; }

    bool CanProcess(MediaType mediaType);

    Task<ProcessorOutput> ProcessAsync(ProcessingContext context, CancellationToken cancellationToken = default);
}
