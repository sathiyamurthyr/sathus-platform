namespace Sathus.Media.Tests.Infrastructure;

public static class InMemoryMediaContextFactory
{
    public static MediaDbContext Create()
    {
        var options = new DbContextOptionsBuilder<MediaDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new MediaDbContext(options);
    }
}
