namespace Sathus.Upload.Tests.Infrastructure;

public static class InMemoryUploadContextFactory
{
    public static UploadDbContext Create()
    {
        var options = new DbContextOptionsBuilder<UploadDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new UploadDbContext(options);
    }
}
