﻿using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatGroupController : ControllerBase
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

        [HttpGet("/membersbychatgroupid/{id}")]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetMembersByChatGroupIdAsync(int id)
        {
            return Ok(await _uow.ChatGroupRepository.GetMemberByChatGroupAsync(id));

        }

        [HttpPost("/chatgroup/{id}/members/{userids}")]
        public async Task AddMembersToChatGroupAsync(int id, string userids)
        {
            int[] ids = userids.Split(',').Select(e => int.Parse(e)).ToArray();
            await _uow.ChatGroupRepository.AddMembersToChatGroupAsync(ids, id);
            await _uow.Complete();

        }

        [HttpPut("/chatgroup/{id}")]
        public async Task UpdateChatGroupAsync([FromBody] ChatGroup chatgroup)
        {
            await _uow.ChatGroupRepository.UpdateChatGroupAsync(chatgroup);
            await _uow.Complete();

        }

        public class OwnerParams
        {
            public string owner { get; set; }
        }
    }
}
