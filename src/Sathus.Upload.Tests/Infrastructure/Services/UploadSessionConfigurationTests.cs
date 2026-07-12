using Microsoft.EntityFrameworkCore;

namespace Sathus.Upload.Tests.Infrastructure.Services;

public class UploadSessionConfigurationTests
{
    [Fact]
    public void UploadDbContext_CanBeCreatedWithInMemoryConfiguration()
    {
        var options = new DbContextOptionsBuilder<UploadDbContext>()
            .UseInMemoryDatabase(databaseName: $"upload-config-{Guid.NewGuid()}")
            .Options;

        var act = () =>
        {
            using var context = new UploadDbContext(options);
            context.UploadSessions.Should().NotBeNull();
            context.UploadChunks.Should().NotBeNull();
            return context;
        };

        act.Should().NotThrow();
    }

    [Fact]
    public void UploadDbContext_DbSets_AreQueryable()
    {
        var options = new DbContextOptionsBuilder<UploadDbContext>()
            .UseInMemoryDatabase(databaseName: $"upload-config-query-{Guid.NewGuid()}")
            .Options;

        using var context = new UploadDbContext(options);

        var sessions = context.UploadSessions.ToList();
        var chunks = context.UploadChunks.ToList();

        sessions.Should().BeEmpty();
        chunks.Should().BeEmpty();
    }
}
