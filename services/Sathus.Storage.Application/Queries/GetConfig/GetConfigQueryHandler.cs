using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Sathus.Storage.Application.DTOs;
using Sathus.Storage.Domain.Interfaces;
using Sathus.Storage.Domain.Enums;
using Sathus.Storage.Domain.Results;

namespace Sathus.Storage.Application.Queries.GetConfig;

public sealed class GetConfigQueryHandler : IRequestHandler<GetConfigQuery, ConfigResponse>
{
    private readonly IStorageProviderFactory _factory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<GetConfigQueryHandler> _logger;

    public GetConfigQueryHandler(IStorageProviderFactory factory, IConfiguration configuration, ILogger<GetConfigQueryHandler> logger)
    {
        _factory = factory;
        _configuration = configuration;
        _logger = logger;
    }

    public Task<ConfigResponse> Handle(GetConfigQuery request, CancellationToken cancellationToken)
    {
        var providers = _factory.GetAllProviders();
        var defaultProvider = _factory.GetDefaultProvider();

        var providerConfigs = providers.Select(provider =>
        {
            var section = _configuration.GetSection($"Storage:Providers:{provider.ProviderName}");
            var settings = section.GetChildren().ToDictionary(x => x.Key, x => x.Value ?? string.Empty, StringComparer.OrdinalIgnoreCase);

            return new ProviderConfigResponse(
                provider.ProviderName,
                provider.ProviderType,
                provider == defaultProvider,
                provider.Location,
                settings);
        }).ToList();

        var defaultSection = _configuration.GetSection("Storage:DefaultProvider");
        var defaultProviderName = defaultProvider.ProviderName;

        if (defaultSection.Exists())
            defaultProviderName = defaultSection.Value ?? defaultProviderName;

        var response = new ConfigResponse(defaultProviderName, providerConfigs);
        return Task.FromResult(response);
    }
}
