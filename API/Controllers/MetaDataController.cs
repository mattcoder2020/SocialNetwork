using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MetaDataController : BaseApiController
    {
        private readonly IUnitOfWork uow;

        public MetaDataController(IUnitOfWork uow)
        {
            this.uow = uow;
        }

        [HttpGet("university")]
        [ApiExplorerSettings(GroupName = "metadata")]

        public async Task<IEnumerable<University>> GetAllUniversities()
        {
            return await uow.UniversityRepository.GetAllAsync();
        }

        
        // POST api/<MetaDataController>
        [HttpPost("university")]
        [ApiExplorerSettings(GroupName = "metadata")]
        public async void PostNewUniversity([FromBody] University value)
        {
            await uow.UniversityRepository.AddAsync(value);
        }

        // DELETE api/<MetaDataController>/5
        [HttpDelete("university/{id}")]
        [ApiExplorerSettings(GroupName = "metadata")]
        public async void Delete(int id)
        {
            await uow.UniversityRepository.DeleteByIdAync(new University { Id=id});
        }

        [HttpGet("major")]
        [ApiExplorerSettings(GroupName = "metadata")]
        public async Task<IEnumerable<Major>> GetAllMajors()
        {
            return await uow.MajorRepository.GetAllAsync();
        }
        // POST api/<MetaDataController>
        [HttpPost("major")]
        [ApiExplorerSettings(GroupName = "metadata")]
        public async void PostNewMajor([FromBody] Major value)
        {
            await uow.MajorRepository.AddAsync(value);
        }

        // DELETE api/<MetaDataController>/5
        [HttpDelete("major/{id}")]
        [ApiExplorerSettings(GroupName = "metadata")]
        public async void DeleteMajor(int id)
        {
            await uow.MajorRepository.DeleteByIdAync(new Major { Id = id });
        }

        [HttpGet("occupation")]
        [ApiExplorerSettings(GroupName = "metadata")]
        public async Task<IEnumerable<Occupation>> GetAllOccupations()
        {
            return await uow.OccupationRepository.GetAllAsync();
        }

        [HttpPost("occupation")]
        [ApiExplorerSettings(GroupName = "metadata")]
        public async void PostNewOccupation([FromBody] Occupation value)
        {
            await uow.OccupationRepository.AddAsync(value);
        }

        [HttpDelete("occupation/{id}")]
        [ApiExplorerSettings(GroupName = "metadata")]
        public async void DeleteOccupation(int id)
        {
            await uow.OccupationRepository.DeleteByIdAync(new Occupation { Id = id });
        }
    }
}
