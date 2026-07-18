"""Authorization seeding."""

from sqlalchemy.ext.asyncio import AsyncSession

from app.authorization.infrastructure.repositories import PermissionRepository, RoleRepository

# Default permissions
DEFAULT_PERMISSIONS = [
    # Identity permissions
    ("identity.user.read", "Read user information"),
    ("identity.user.create", "Create users"),
    ("identity.user.update", "Update users"),
    ("identity.user.delete", "Delete users"),
    ("identity.user.manage", "Manage users"),
    # Content permissions
    ("content.page.read", "Read pages"),
    ("content.page.create", "Create pages"),
    ("content.page.update", "Update pages"),
    ("content.page.delete", "Delete pages"),
    ("content.page.publish", "Publish pages"),
    ("content.blog.create", "Create blog posts"),
    ("content.blog.publish", "Publish blog posts"),
    # Media permissions
    ("media.asset.upload", "Upload media assets"),
    ("media.asset.delete", "Delete media assets"),
    # Workflow permissions
    ("workflow.review", "Review workflows"),
    ("workflow.publish", "Publish workflows"),
    # Search permissions
    ("search.manage", "Manage search"),
    # Admin permissions
    ("admin.access", "Access admin panel"),
]

# Default roles with their permissions
DEFAULT_ROLES = {
    "Super Administrator": [
        "identity.user.manage",
        "content.page.publish",
        "content.blog.publish",
        "media.asset.upload",
        "media.asset.delete",
        "workflow.review",
        "workflow.publish",
        "search.manage",
        "admin.access",
    ],
    "Administrator": [
        "identity.user.read",
        "identity.user.update",
        "content.page.read",
        "content.page.create",
        "content.page.update",
        "content.page.publish",
        "content.blog.create",
        "content.blog.publish",
        "media.asset.upload",
        "media.asset.delete",
        "workflow.review",
        "search.manage",
    ],
    "Editor": [
        "content.page.read",
        "content.page.create",
        "content.page.update",
        "content.page.publish",
        "content.blog.create",
        "content.blog.publish",
    ],
    "Reviewer": [
        "content.page.read",
        "workflow.review",
    ],
    "Author": [
        "content.page.create",
        "content.page.update",
        "content.blog.create",
    ],
    "Support": [
        "identity.user.read",
    ],
    "Customer": [
        "content.page.read",
    ],
    "Developer": [
        "search.manage",
    ],
}


async def seed_permissions(db: AsyncSession) -> None:
    """Seed default permissions."""
    permission_repo = PermissionRepository(db)

    for perm_name, description in DEFAULT_PERMISSIONS:
        resource, action = perm_name.split(".")
        existing = await permission_repo.get_by_resource_action(resource, action)
        if not existing:
            await permission_repo.create(
                resource=resource,
                action=action,
                description=description,
                group=resource,
            )


async def seed_roles(db: AsyncSession) -> None:
    """Seed default roles."""
    role_repo = RoleRepository(db)
    permission_repo = PermissionRepository(db)

    for role_name, permission_names in DEFAULT_ROLES.items():
        existing = await role_repo.get_by_name(role_name)
        if not existing:
            permission_ids = []
            for perm_name in permission_names:
                resource, action = perm_name.split(".")
                perm = await permission_repo.get_by_resource_action(resource, action)
                if perm:
                    permission_ids.append(perm.id)

            await role_repo.create(
                name=role_name,
                description=f"System role: {role_name}",
                permission_ids=permission_ids,
            )


async def seed_authorization(db: AsyncSession) -> None:
    """Seed all authorization data."""
    await seed_permissions(db)
    await seed_roles(db)