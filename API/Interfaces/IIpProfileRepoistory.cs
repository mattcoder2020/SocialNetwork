using API.Entities;

namespace API.Interfaces
{
    public interface IIpProfileRepoistory
    {
        Task<IpProfile> GetIpProfileByIpAddressAsync(string ipAddress);
        Task<IpProfile> GetIpProfileByIdAsync(int id);
        Task<List<IpProfile>> GetAllIpProfiles();
        Task AddIpProfileAsync(string ipAddress);
        
    }
}
