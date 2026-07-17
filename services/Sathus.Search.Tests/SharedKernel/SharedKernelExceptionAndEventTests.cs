global using FluentAssertions;
global using Xunit;
global using Sathus.SharedKernel.Events;
global using Sathus.SharedKernel.Exceptions;

namespace Sathus.Search.Tests.SharedKernel;

public class SharedKernelExceptionAndEventTests
{
    [Fact]
    public void AppException_Should_Allow_Message()
    {
        var ex = new AppException("test error");

        ex.Message.Should().Be("test error");
    }

    [Fact]
    public void DomainEvent_Should_Store_OccurredAt()
    {
        var evt = new TestDomainEvent();

        evt.OccurredAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    private sealed class TestDomainEvent : DomainEvent;
}
