using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContextIpProfile:DbContext
    {
        public DataContextIpProfile(DbContextOptions<DataContextIpProfile> options) : base(options)
        {
        }

        public DbSet<IpProfile> IpProfiles { get; set; }
        public DbSet<VisitedPath>  VisitedPaths { get; set; }
        
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);                                          
        }
    }
}