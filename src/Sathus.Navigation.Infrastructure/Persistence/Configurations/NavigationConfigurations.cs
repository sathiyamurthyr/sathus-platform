using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Navigation.Domain.Entities;
using Sathus.Navigation.Domain.Enums;

namespace Sathus.Navigation.Infrastructure.Persistence.Configurations;

public sealed class NavigationTreeConfiguration : IEntityTypeConfiguration<NavigationTree>
{
    public void Configure(EntityTypeBuilder<NavigationTree> builder)
    {
        builder.ToTable("navigation_trees");
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Platform).HasConversion<int>().IsRequired();
        builder.Property(t => t.Name).HasMaxLength(256).IsRequired();
        builder.Property(t => t.DefaultLocale).HasMaxLength(10).IsRequired();
        builder.Property(t => t.Description).HasMaxLength(2000);
        builder.Property(t => t.Status).HasConversion<int>().IsRequired();
        builder.HasQueryFilter(t => !t.IsDeleted);
        builder.HasMany(t => t.Menus).WithOne().HasForeignKey("TreeId");
        builder.HasMany(t => t.Redirects).WithOne().HasForeignKey(r => r.TreeId);
        builder.HasMany(t => t.History).WithOne().HasForeignKey(h => h.TreeId);
    }
}

public sealed class NavigationMenuConfiguration : IEntityTypeConfiguration<NavigationMenu>
{
    public void Configure(EntityTypeBuilder<NavigationMenu> builder)
    {
        builder.ToTable("navigation_menus");
        builder.HasKey(m => m.Id);
        builder.HasOne<NavigationTree>().WithMany(t => t.Menus).HasForeignKey(m => m.TreeId);
        builder.Property(m => m.Name).HasMaxLength(256).IsRequired();
        builder.Property(m => m.MenuTypeValue).HasMaxLength(64).IsRequired();
        builder.Property(m => m.Locale).HasMaxLength(10).IsRequired();
        builder.Property(m => m.Status).HasConversion<int>().IsRequired();
        builder.HasQueryFilter(m => !m.IsDeleted);
        builder.HasMany(m => m.Nodes).WithOne().HasForeignKey(n => n.MenuId);
        builder.HasMany(m => m.Versions).WithOne().HasForeignKey(v => v.MenuId);
        builder.HasMany(m => m.Items).WithOne().HasForeignKey(i => i.MenuId);
        builder.HasMany(m => m.Routes).WithOne().HasForeignKey(r => r.MenuId);
    }
}

public sealed class NavigationNodeConfiguration : IEntityTypeConfiguration<NavigationNode>
{
    public void Configure(EntityTypeBuilder<NavigationNode> builder)
    {
        builder.ToTable("navigation_nodes");
        builder.HasKey(n => n.Id);
        builder.Property(n => n.MenuId).IsRequired();
        builder.Property(n => n.ParentId);
        builder.Property(n => n.SortOrder).IsRequired();
        builder.Property(n => n.Depth).IsRequired();
        builder.Property(n => n.ItemType).HasConversion<int>().IsRequired();
        builder.Property(n => n.DisplayName).HasMaxLength(256).IsRequired();
        builder.Property(n => n.RoutePath).HasMaxLength(2048);
        builder.Property(n => n.TargetType).HasConversion<int>().IsRequired();
        builder.Property(n => n.TargetUrl).HasMaxLength(2048);
        builder.Property(n => n.ReferenceKind).HasConversion<int>().IsRequired();
        builder.Property(n => n.Icon).HasMaxLength(128);
        builder.Property(n => n.CssClass).HasMaxLength(256);
        builder.HasQueryFilter(n => !n.IsDeleted);
        builder.HasOne<NavigationMenu>().WithMany(m => m.Nodes).HasForeignKey(n => n.MenuId);
        builder.HasMany(n => n.Children).WithOne(n => n.Parent).HasForeignKey(n => n.ParentId);

        builder.OwnsMany(n => n.Localizations, l =>
        {
            l.ToTable("navigation_node_localizations");
            l.Property(p => p.LanguageCode).HasMaxLength(10).IsRequired();
            l.Property(p => p.DisplayName).HasMaxLength(256).IsRequired();
            l.Property(p => p.RoutePath).HasMaxLength(2048);
        });

        builder.OwnsMany(n => n.Permissions, p =>
        {
            p.ToTable("navigation_node_permissions");
            p.Property(x => x.Permission).HasMaxLength(128).IsRequired();
            p.Property(x => x.Role).HasMaxLength(128);
            p.Property(x => x.Requirement).HasConversion<int>();
            p.Property(x => x.Effect).HasConversion<int>();
        });

        builder.OwnsMany(n => n.VisibilityRules, v =>
        {
            v.ToTable("navigation_node_visibility_rules");
            v.Property(x => x.RuleType).HasConversion<int>();
            v.Property(x => x.Value).HasMaxLength(512);
            v.Property(x => x.Effect).HasConversion<int>();
        });
    }
}

public sealed class NavigationVersionConfiguration : IEntityTypeConfiguration<NavigationVersion>
{
    public void Configure(EntityTypeBuilder<NavigationVersion> builder)
    {
        builder.ToTable("navigation_versions");
        builder.HasKey(v => v.Id);
        builder.HasOne<NavigationMenu>().WithMany(m => m.Versions).HasForeignKey(v => v.MenuId);
        builder.Property(v => v.Label).HasMaxLength(256).IsRequired();
        builder.Property(v => v.Status).HasConversion<int>().IsRequired();
        builder.Property(v => v.Snapshot).HasColumnType("text").IsRequired();
        builder.Property(v => v.IsCurrent).IsRequired();
    }
}

public sealed class NavigationItemConfiguration : IEntityTypeConfiguration<NavigationItem>
{
    public void Configure(EntityTypeBuilder<NavigationItem> builder)
    {
        builder.ToTable("navigation_items");
        builder.HasKey(i => i.Id);
        builder.HasOne<NavigationMenu>().WithMany(m => m.Items).HasForeignKey(i => i.MenuId);
        builder.Property(i => i.DisplayName).HasMaxLength(256).IsRequired();
        builder.Property(i => i.RoutePath).HasMaxLength(2048);
        builder.Property(i => i.TargetUrl).HasMaxLength(2048);
        builder.Property(i => i.TargetType).HasConversion<int>().IsRequired();
        builder.Property(i => i.ItemType).HasConversion<int>().IsRequired();
        builder.Property(i => i.ReferenceKind).HasConversion<int>().IsRequired();
        builder.Property(i => i.Locale).HasMaxLength(10).IsRequired();
        builder.Property(i => i.Icon).HasMaxLength(128);
        builder.Property(i => i.CssClass).HasMaxLength(256);
        builder.Property(i => i.VisibilityRulesJson).HasColumnType("text");
        builder.Property(i => i.RequiredPermissionsJson).HasColumnType("text");
        builder.HasIndex(i => new { i.MenuId, i.VersionId, i.Depth });
    }
}

public sealed class NavigationRouteConfiguration : IEntityTypeConfiguration<NavigationRoute>
{
    public void Configure(EntityTypeBuilder<NavigationRoute> builder)
    {
        builder.ToTable("navigation_routes");
        builder.HasKey(r => r.Id);
        builder.HasOne<NavigationMenu>().WithMany(m => m.Routes).HasForeignKey(r => r.MenuId);
        builder.Property(r => r.RoutePath).HasMaxLength(2048).IsRequired();
        builder.Property(r => r.TargetUrl).HasMaxLength(2048);
        builder.Property(r => r.RouteKind).HasConversion<int>().IsRequired();
        builder.Property(r => r.CanonicalPath).HasMaxLength(2048);
        builder.Property(r => r.AliasesJson).HasColumnType("text");
        builder.Property(r => r.ReferenceKind).HasConversion<int>().IsRequired();
        builder.HasIndex(r => new { r.MenuId, r.RoutePath });
    }
}

public sealed class NavigationRedirectConfiguration : IEntityTypeConfiguration<NavigationRedirect>
{
    public void Configure(EntityTypeBuilder<NavigationRedirect> builder)
    {
        builder.ToTable("navigation_redirects");
        builder.HasKey(r => r.Id);
        builder.HasOne<NavigationTree>().WithMany(t => t.Redirects).HasForeignKey(r => r.TreeId);
        builder.Property(r => r.SourcePath).HasMaxLength(2048).IsRequired();
        builder.Property(r => r.TargetPath).HasMaxLength(2048).IsRequired();
        builder.Property(r => r.RedirectType).HasConversion<int>().IsRequired();
        builder.Property(r => r.Locale).HasMaxLength(10).IsRequired();
        builder.HasIndex(r => new { r.TreeId, r.SourcePath });
    }
}

public sealed class NavigationHistoryConfiguration : IEntityTypeConfiguration<NavigationHistory>
{
    public void Configure(EntityTypeBuilder<NavigationHistory> builder)
    {
        builder.ToTable("navigation_history");
        builder.HasKey(h => h.Id);
        builder.HasOne<NavigationTree>().WithMany(t => t.History).HasForeignKey(h => h.TreeId);
        builder.Property(h => h.Operation).HasConversion<int>().IsRequired();
        builder.Property(h => h.Payload).HasColumnType("text");
        builder.HasIndex(h => new { h.TreeId, h.OccurredAt });
    }
}
