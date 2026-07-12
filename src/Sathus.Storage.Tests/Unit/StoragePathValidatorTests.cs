using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Xunit;

namespace Sathus.Storage.Tests.Unit;

public class StoragePathValidatorTests
{
    private static StoragePathValidator CreateValidator()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        var sp = services.BuildServiceProvider();
        var logger = sp.GetRequiredService<ILogger<Security.StoragePathValidator>>();
        return new Security.StoragePathValidator(logger);
    }

    [Theory]
    [InlineData("valid-key.txt")]
    [InlineData("folder/subfolder/file.pdf")]
    [InlineData("a")]
    public void ValidateKey_ValidKeys_ShouldNotThrow(string key)
    {
        var validator = CreateValidator();
        validator.Invoking(v => v.ValidateKey(key)).Should().NotThrow();
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("  ")]
    public void ValidateKey_NullOrEmpty_ShouldThrow(string? key)
    {
        var validator = CreateValidator();
        validator.Invoking(v => v.ValidateKey(key!)).Should().Throw<ArgumentException>();
    }

    [Theory]
    [InlineData("../etc/passwd")]
    [InlineData("..\\windows\\system32")]
    [InlineData("valid/../../etc/passwd")]
    public void ValidateKey_PathTraversal_ShouldThrow(string key)
    {
        var validator = CreateValidator();
        validator.Invoking(v => v.ValidateKey(key)).Should().Throw<ArgumentException>();
    }
}
