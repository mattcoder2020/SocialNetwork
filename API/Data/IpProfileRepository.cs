using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using System.Globalization;
using System.Linq;
using System.Net;

namespace API.Data
{
    public class IpProfileRepository : IIpProfileRepoistory
    {
        private readonly IMemoryCache memoryCache;
        private readonly DataContextIpProfile dataContextIpProfile;
        private HttpContext httpcontext;
        private readonly string ProfileCache = "profile";
        

        public IpProfileRepository(IMemoryCache memoryCache, DataContextIpProfile dataContextIpProfile)
        {
            this.memoryCache = memoryCache;
            this.dataContextIpProfile = dataContextIpProfile;
           
        }
        public async Task<IpProfile> AddIpProfileAsync(string IpAddress)
        {
            List<IpProfile> ipProfiles = await GetAllIpProfiles();
            IpProfile ipProfile = null;
            //fetch cache from httpcontext cache or db
            //if it is not in the cache and db, then get it from the ipinfo.io
            if (ipProfiles.Find(e => e.IpAddress == IpAddress) == null)
            {
                //get the profile from ipinfo.io
                ipProfile = await GetIpProfileByIpAddressAsync(IpAddress);
                // if failed to get the profile from ipinfo.io, then return
                if (ipProfile == null) return null;
                // otherwise persist to db and cache
                dataContextIpProfile.Set<IpProfile>().Add(ipProfile);
                await dataContextIpProfile.SaveChangesAsync();

                // Fetch the resultant ipProfiles from the database
                ipProfile = dataContextIpProfile.Set<IpProfile>().FirstOrDefault(e => e.IpAddress == IpAddress);

                ipProfiles.Add(ipProfile);
                memoryCache.Set(ProfileCache, ipProfiles);

                return ipProfile;

            }
            else
            {
                return ipProfiles.Find(e => e.IpAddress == IpAddress);
            }
        }

        public async Task<List<IpProfile>> GetAllIpProfiles()
        {
            List<IpProfile> ipProfiles = null;
            //if cache is empty the populate the cache from the database
            // and persist the cache to the httpcontext cache
            if (!memoryCache.TryGetValue(ProfileCache, out ipProfiles))
            {
                ipProfiles = await dataContextIpProfile.Set<IpProfile>().ToListAsync();
                memoryCache.Set(ProfileCache, ipProfiles);
            }
            return ipProfiles;
        }

        public Task<IpProfile> GetIpProfileByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IpProfile> GetIpProfileByIpAddressAsync(string ipAddress)
        {
            try
            {
                string info = await new WebClient().DownloadStringTaskAsync("https://ipinfo.io/" + ipAddress+ "?token=ceb8e0c839bd03");
                var ipInfo = JsonConvert.DeserializeObject<IpInfo>(info);
                RegionInfo regionalInfo = new RegionInfo(ipInfo.Country);
                ipInfo.Country = regionalInfo.EnglishName;

                var ipProfile = new IpProfile();
                ipProfile.IpAddress = ipAddress;
                ipProfile.Country = ipInfo.Country;
                ipProfile.City = ipInfo.City;
            
                return ipProfile;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                    ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
                return null;
            }
        }
    }
}
