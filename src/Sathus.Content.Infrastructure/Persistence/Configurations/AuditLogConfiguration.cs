namespace Sathus.Content.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Content.Domain.Entities;

public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.ToTable("audit_logs");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Action)
            .IsRequired()
            .HasMaxLength(128);

        builder.Property(a => a.EntityType)
            .IsRequired()
            .HasMaxLength(128);

        builder.Property(a => a.EntityId)
            .IsRequired()
            .HasMaxLength(128);

        builder.Property(a => a.Changes)
            .HasMaxLength(4000);

        builder.Property(a => a.IpAddress)
            .HasMaxLength(64);

        builder.HasIndex(a => new { a.EntityType, a.EntityId, a.CreatedAt });
    }
}
