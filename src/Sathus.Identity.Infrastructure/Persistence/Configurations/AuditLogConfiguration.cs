namespace Sathus.Identity.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Identity.Domain.Entities;

public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.ToTable("audit_logs");

        builder.HasKey(al => al.Id);

        builder.Property(al => al.ActorId);

        builder.Property(al => al.ActorEmail)
            .HasMaxLength(256);

        builder.Property(al => al.Action)
            .IsRequired()
            .HasMaxLength(128);

        builder.Property(al => al.EntityType)
            .IsRequired()
            .HasMaxLength(128);

        builder.Property(al => al.EntityId)
            .IsRequired()
            .HasMaxLength(128);

        builder.Property(al => al.Changes)
            .HasMaxLength(1024);

        builder.Property(al => al.IpAddress)
            .HasMaxLength(64);

        builder.Property(al => al.CreatedAt)
            .IsRequired();

        builder.HasIndex(al => new { al.ActorId, al.CreatedAt });

        builder.HasIndex(al => new { al.EntityType, al.EntityId, al.CreatedAt });
    }
}
