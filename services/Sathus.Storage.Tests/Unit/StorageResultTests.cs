using FluentAssertions;
using Xunit;

namespace Sathus.Storage.Tests.Unit;

public class StorageResultTests
{
    [Fact]
    public void Success_ShouldReturnSuccessfulResult()
    {
        var result = Domain.Results.StorageResult.Success();
        result.Succeeded.Should().BeTrue();
        result.Error.Should().BeNull();
    }

    [Fact]
    public void Failure_ShouldReturnFailedResult()
    {
        var result = Domain.Results.StorageResult.Failure("Something went wrong", "error.code");
        result.Succeeded.Should().BeFalse();
        result.Error.Should().Be("Something went wrong");
        result.ErrorCode.Should().Be("error.code");
    }
}
