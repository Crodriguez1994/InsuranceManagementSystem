using InsuranceConsulting.Application.Common;
using InsuranceConsulting.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace InsuranceConsulting.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        private readonly ICurrentUserService _currentUser;
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options,
            ICurrentUserService currentUser)
           : base(options)
        {
            _currentUser = currentUser;
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Client> Clients => Set<Client>();
        public DbSet<Insurance> Insurances => Set<Insurance>();
        //public DbSet<ClientInsurance> ClientInsurances => Set<ClientInsurance>();

        public override int SaveChanges()
        {
            ApplyAudit();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            ApplyAudit();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void ApplyAudit()
        {
            var userId = _currentUser.UserId ?? 0;
            var now = DateTime.Now;

            foreach (var entry in ChangeTracker.Entries<BaseEntity>())
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedDate = now;
                    entry.Entity.UserCreated = userId;
                    entry.Entity.Status = true;
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Entity.ModifiedDate = now;
                    entry.Entity.UserModified = userId;
                }
                else if (entry.State == EntityState.Deleted)
                {
                    entry.State = EntityState.Modified;
                    entry.Entity.Status = false;
                    entry.Entity.ModifiedDate = now;
                    entry.Entity.UserModified = userId;

                    if (entry.Entity is Client client)
                    {
                        client.IsDeleted = true;
                    }
                }
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

        }
    }
}
