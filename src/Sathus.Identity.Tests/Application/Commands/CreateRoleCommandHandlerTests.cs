using FluentAssertions;
using Moq;
using Sathus.Identity.Application.Commands.CreateRole;
using Sathus.Identity.Application.DTOs;
using Sathus.Identity.Application.Exceptions;
using Sathus.Identity.Application.Interfaces;
using Sathus.Identity.Domain.Entities;
using Xunit;

namespace Sathus.Identity.Tests.Application.Commands;

public class CreateRoleCommandHandlerTests
{
    private static Role CreatedRole(string name) => new Role(name);

    [Fact]
    public async Task Handle_UniqueName_ReturnsRoleResponse()
    {
        var roles = new Mock<IRoleRepository>();
        roles.Setup(r => r.ExistsByNameAsync(It.IsAny<string>(), It.IsAny<CancellationToken>())).ReturnsAsync(false);
        roles.Setup(r => r.AddAsync(It.IsAny<Role>(), It.IsAny<CancellationToken>()))
            .Callback<Role, CancellationToken>((role, _) => role.SetDescription("Admin access", DateTime.UtcNow));
        var audit = new Mock<IAuditService>();

        var handler = new CreateRoleCommandHandler(roles.Object, audit.Object);

        var result = await handler.Handle(new CreateRoleCommand("PlatformAdmin", "Admin access"), CancellationToken.None);

        result.Name.Should().Be("PlatformAdmin");
        result.Description.Should().Be("Admin access");
        roles.Verify(r => r.AddAsync(It.IsAny<Role>(), It.IsAny<CancellationToken>()), Times.Once);
        audit.Verify(a => a.LogAsync(It.IsAny<AuditEntry>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_DuplicateName_ThrowsRoleAlreadyExistsException()
    {
        var roles = new Mock<IRoleRepository>();
        roles.Setup(r => r.ExistsByNameAsync(It.IsAny<string>(), It.IsAny<CancellationToken>())).ReturnsAsync(true);

        var handler = new CreateRoleCommandHandler(roles.Object, Mock.Of<IAuditService>());

        var act = async () => await handler.Handle(new CreateRoleCommand("PlatformAdmin"), CancellationToken.None);

        await act.Should().ThrowAsync<RoleAlreadyExistsException>();
    }
}
