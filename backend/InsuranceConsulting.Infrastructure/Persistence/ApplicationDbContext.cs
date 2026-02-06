using InsuranceConsulting.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace InsuranceConsulting.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
           : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Client> Clients => Set<Client>();
        public DbSet<Insurance> Insurances => Set<Insurance>();
        //public DbSet<ClientInsurance> ClientInsurances => Set<ClientInsurance>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

        }
    }
}
