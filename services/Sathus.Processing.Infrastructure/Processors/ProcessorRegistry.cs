using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging.Abstractions;
using Sathus.Media.Domain.ValueObjects;
using Sathus.Processing.Application.Interfaces;
using Sathus.Processing.Domain.Interfaces;

namespace Sathus.Processing.Infrastructure.Processors;

/// <summary>
/// Resolves the most specific <see cref="IAssetProcessor"/> for a media type. Unknown
/// assets fall back to the <see cref="UnknownProcessor"/> so the pipeline always has a
/// processor to run.
/// </summary>
public sealed class ProcessorRegistry : IProcessorRegistry
{
    private readonly IReadOnlyList<IAssetProcessor> _processors;
    private readonly UnknownProcessor _unknown;

    public ProcessorRegistry(IEnumerable<IAssetProcessor> processors)
    {
        var list = processors.ToList();
        _unknown = list.OfType<UnknownProcessor>().FirstOrDefault() ?? new UnknownProcessor(NullLogger<UnknownProcessor>.Instance);
        _processors = list;
    }

    public IAssetProcessor? Resolve(MediaType mediaType)
    {
        var specific = _processors.FirstOrDefault(p => p is not UnknownProcessor && p.CanProcess(mediaType));
        return specific ?? _unknown;
    }

    public IReadOnlyList<IAssetProcessor> GetAll() => _processors;
}
