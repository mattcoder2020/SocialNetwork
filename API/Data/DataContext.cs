using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : IdentityDbContext<AppUser, AppRole, int, 
        IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>, 
        IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<UserLike> Likes { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Connection> Connections { get; set; }
        public DbSet<ChatGroup> ChatGroups { get; set; }
        public DbSet<ChatGroupMessage> ChatGroupMessages { get; set; }
        public DbSet<ChatGroupMember> ChatGroupMembers { get; set; }
        public DbSet<ChatGroupConnection> ChatGroupConnections { get; set; }
        public DbSet<University> Universities { get; set; }
        public DbSet<Major> Majors { get; set; }
        public DbSet<Occupation> Occupations { get; set; }




        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
                                                                                                         
            builder.Entity<AppUser>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(ur => ur.User)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();

            builder.Entity<AppRole>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(ur => ur.Role)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();

            builder.Entity<AppUser>()
                .HasMany(cgm=>cgm.ChatGroupMembers)
                .WithOne(cgm=>cgm.Member)
                .HasForeignKey(cgm=>cgm.AppUserId)
                .IsRequired();

            builder.Entity<ChatGroup>()
                .HasMany(cgm => cgm.ChatGroupMembers)
                .WithOne(cgm => cgm.ChatGroup)
                .HasForeignKey(cgm => cgm.ChatGroupId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade); ;

            builder.Entity<ChatGroup>()
                .HasMany(cg => cg.ChatGroupConnections)
                .WithOne(cgc => cgc.ChatGroup)
                .HasForeignKey(cgm => cgm.ChatGroupId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ChatGroup>()
                .HasMany(cg => cg.ChatGroupMessages)
                 .WithOne(cgc => cgc.ChatGroup)
                 .HasForeignKey(cgm => cgm.ChatGroupId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ChatGroupConnection>()
               .HasKey(k => new { k.ChatGroupId, k.UserName });


            builder.Entity<UserLike>()
                .HasKey(k => new { k.SourceUserId, k.TargetUserId });


            builder.Entity<UserLike>()
                .HasOne(s => s.SourceUser)
                .WithMany(l => l.LikedUsers)
                .HasForeignKey(s => s.SourceUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserLike>()
                .HasOne(s => s.TargetUser)
                .WithMany(l => l.LikedByUsers)
                .HasForeignKey(s => s.TargetUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Message>()
                .HasOne(u => u.Recipient)
                .WithMany(m => m.MessagesReceived)
                .OnDelete(DeleteBehavior.Restrict);
            
            builder.Entity<Message>()
                .HasOne(u => u.Sender)
                .WithMany(m => m.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);

            

            builder.Entity<ChatGroupMember>()
               .HasKey(k => new { k.ChatGroupId, k.AppUserId });

           
        }
    }
}