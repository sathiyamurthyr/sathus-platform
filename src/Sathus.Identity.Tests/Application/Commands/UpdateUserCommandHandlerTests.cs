using FluentAssertions;
using Moq;
using Sathus.Identity.Application.Commands.UpdateUser;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Exceptions;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Domain.Enums;
using Xunit;

namespace Sathus.Identity.Tests.Application.Commands;

public class UpdateUserCommandHandlerTests
{
    [Fact]
    public async Task Handle_ExistingUser_UpdatesProfileAndStatus()
    {
        var user = new User("ada@example.com", "Ada", "Lovelace", "hashed", AuthProvider.Local);
        var repo = new Mock<IUserRepository>();
        repo.Setup(r => r.GetByIdAsync(user.Id, It.IsAny<CancellationToken>())).ReturnsAsync(user);
        repo.Setup(r => r.GetRoleNamesAsync(user.Id, It.IsAny<CancellationToken>())).ReturnsAsync(new[] { "PlatformAdmin" });

        var handler = new UpdateUserCommandHandler(repo.Object, Mock.Of<IAuditService>());

        var result = await handler.Handle(
            new UpdateUserCommand(user.Id, "Ada", "Byron", UserStatus.Suspended, new[] { Guid.NewGuid() }),
            CancellationToken.None);

        result.FirstName.Should().Be("Ada");
        result.LastName.Should().Be("Byron");
        result.Status.Should().Be(UserStatus.Suspended);
        repo.Verify(r => r.UpdateAsync(user, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_MissingUser_ThrowsUserNotFoundException()
    {
        var repo = new Mock<IUserRepository>();
        repo.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>())).ReturnsAsync((User?)null);

        var handler = new UpdateUserCommandHandler(repo.Object, Mock.Of<IAuditService>());

        var act = async () => await handler.Handle(
            new UpdateUserCommand(Guid.NewGuid(), "A", "B"),
            CancellationToken.None);

        await act.Should().ThrowAsync<UserNotFoundException>();
    }
}
