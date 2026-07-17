namespace Sathus.Identity.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sathus.Identity.Domain.Entities;

public class UserSessionConfiguration : IEntityTypeConfiguration<UserSession>
{
    public void Configure(EntityTypeBuilder<UserSession> builder)
    {
        builder.ToTable("user_sessions");

        builder.HasKey(us => us.Id);

        builder.Property(us => us.UserId)
            .IsRequired();

        builder.Property(us => us.IpAddress)
            .HasMaxLength(64);

        builder.Property(us => us.UserAgent)
            .HasMaxLength(512);

        builder.Property(us => us.CreatedAt)
            .IsRequired();

        builder.Property(us => us.ExpiresAt)
            .IsRequired();

        builder.Property(us => us.LastActivityAt);

        builder.Property(us => us.RevokedAt);

        builder.HasIndex(us => new { us.UserId, us.ExpiresAt });

        builder.HasOne(us => us.User)
            .WithMany(u => u.UserSessions)
            .HasForeignKey(us => us.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
