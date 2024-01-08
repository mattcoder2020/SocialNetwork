using API.Entities;
using API.Interfaces;

namespace API.Data
{
    public class VisitorPathRepository : IVisitorPathRepository
    {
        private readonly DataContextIpProfile dataContextIpProfile;

        public VisitorPathRepository(DataContextIpProfile dataContextIpProfile)
        {
            this.dataContextIpProfile = dataContextIpProfile;
        }
        public async Task AddVisitedPathAsync(VisitedPath visitedPath)
        {
            dataContextIpProfile.Set<VisitedPath>().Add(visitedPath);
            await dataContextIpProfile.SaveChangesAsync();
        }

        public Task<List<VisitedPath>> GetAllVisitedPaths()
        {
            throw new NotImplementedException();
        }

        public Task<VisitedPath> GetVisitedPathByIpProfileIdAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
