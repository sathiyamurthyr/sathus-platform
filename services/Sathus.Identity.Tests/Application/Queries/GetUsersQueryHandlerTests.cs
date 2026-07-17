using FluentAssertions;
using Moq;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Application.Queries.GetUsers;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Domain.Enums;
using Xunit;

namespace Sathus.Identity.Tests.Application.Queries;

public class GetUsersQueryHandlerTests
{
    [Fact]
    public async Task Handle_ReturnsPagedSummariesWithRoles()
    {
        var user = new User("ada@example.com", "Ada", "Lovelace", "hashed", AuthProvider.Local);

        var repo = new Mock<IUserRepository>();
        repo.Setup(r => r.GetPagedAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string?>(), It.IsAny<UserStatus?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new PagedResult<User>(new[] { user }, 1, 20, 1));
        repo.Setup(r => r.GetRoleNamesAsync(user.Id, It.IsAny<CancellationToken>())).ReturnsAsync(new[] { "PlatformAdmin" });

        var handler = new GetUsersQueryHandler(repo.Object);

        var result = await handler.Handle(new GetUsersQuery(), CancellationToken.None);

        result.Items.Should().HaveCount(1);
        result.TotalCount.Should().Be(1);
        result.Items[0].Email.Should().Be("ada@example.com");
        result.Items[0].Roles.Should().Contain("PlatformAdmin");
    }
}
