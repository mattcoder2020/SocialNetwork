using API.Entities;

namespace API.Interfaces
{
    public interface IVisitorPathRepository
    {
        Task<VisitedPath> GetVisitedPathByIpProfileIdAsync(int id);
        Task AddVisitedPathAsync(VisitedPath visitedPath);
        Task<List<VisitedPath>> GetAllVisitedPaths();
    }
}
