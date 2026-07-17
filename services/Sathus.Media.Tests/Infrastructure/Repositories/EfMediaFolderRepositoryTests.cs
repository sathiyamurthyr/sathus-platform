using Sathus.Media.Tests.Infrastructure;

namespace Sathus.Media.Tests.Infrastructure.Repositories;

public class EfMediaFolderRepositoryTests
{
    [Fact]
    public async Task GetRoots_And_GetChildren_Work()
    {
        using var db = InMemoryMediaContextFactory.Create();
        var repo = new EfMediaFolderRepository(db, new Mock<IMediator>().Object);

        var root = new MediaFolder("Root", "root");
        var child = new MediaFolder("Child", "child", parentFolderId: root.Id);
        var otherRoot = new MediaFolder("Other", "other");

        await repo.AddAsync(root);
        await repo.AddAsync(child);
        await repo.AddAsync(otherRoot);
        await repo.SaveChangesAsync();

        var roots = await repo.GetRootsAsync();
        roots.Should().HaveCount(2);

        var children = await repo.GetChildrenAsync(root.Id);
        children.Should().ContainSingle().Which.Name.Should().Be("Child");
    }
}
