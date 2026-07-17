namespace Sathus.Identity.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Identity.Domain.Entities;
using Sathus.Identity.Domain.Enums;

public class LoginHistoryConfiguration : IEntityTypeConfiguration<LoginHistory>
{
    public void Configure(EntityTypeBuilder<LoginHistory> builder)
    {
        builder.ToTable("login_history");

        builder.HasKey(lh => lh.Id);

        builder.Property(lh => lh.UserId)
            .IsRequired();

        builder.Property(lh => lh.IpAddress)
            .HasMaxLength(64);

        builder.Property(lh => lh.UserAgent)
            .HasMaxLength(512);

        builder.Property(lh => lh.Status)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(lh => lh.FailureReason)
            .HasMaxLength(256);

        builder.Property(lh => lh.CreatedAt)
            .IsRequired();

        builder.HasIndex(lh => new { lh.UserId, lh.CreatedAt });

        builder.HasOne(lh => lh.User)
            .WithMany(u => u.LoginHistory)
            .HasForeignKey(lh => lh.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
