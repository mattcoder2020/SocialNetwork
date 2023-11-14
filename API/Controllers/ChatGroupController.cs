using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    public class ChatGroupController : BaseApiController
    {
        private readonly IUnitOfWork _uow;


        public ChatGroupController(IUnitOfWork uow)
        {
            //provide the readonly IUnitOfWork uow
            this._uow = uow;

        }

        //[Route("/owner/{ownername}")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChatGroupDto>>> GetChatgroupsByUserNameAsync([FromQuery] OwnerParams ownerparam)
        {
            return Ok(await _uow.ChatGroupRepository.GetChatGroupsByUserNameAsync(ownerparam.owner));

        }

        [HttpGet("membersbychatgroupid/{id}")]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetMembersByChatGroupIdAsync(int id)
        {
            return Ok(await _uow.ChatGroupRepository.GetMemberByChatGroupAsync(id));

        }

        [HttpPost("{id}/members/{userids}")]
        public async Task AddMembersToChatGroupAsync(int id, string userids)
        {
            int[] ids = userids.Split(',').Select(e => int.Parse(e)).ToArray();
            await _uow.ChatGroupRepository.AddMembersToChatGroupAsync(ids, id);
            await _uow.Complete();

        }

        [HttpPut("{id}")]
        public async Task UpdateChatGroupAsync([FromBody] ChatGroup chatgroup)
        {
            await _uow.ChatGroupRepository.UpdateChatGroupAsync(chatgroup);
            await _uow.Complete();

        }

        [HttpPost()]
        public async Task<int?> CreateChatGroupAsync([FromBody] ChatGroup chatgroup)
        {
            await _uow.ChatGroupRepository.AddChatGroupAsync(chatgroup);
            await _uow.Complete();
            var newchatgroup = await _uow.ChatGroupRepository.GetChatGroupByNameAsync(chatgroup.Name);
            return newchatgroup.Id;
        }

        public class OwnerParams
        {
            public string owner { get; set; }
        }
    }
}
