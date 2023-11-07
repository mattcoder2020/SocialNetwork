﻿using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Http;
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
        [HttpGet("{ownername}")]
        public async Task<ActionResult<IEnumerable<ChatGroupDto>>> GetChatgroupsByUserNameAsync(string ownername)
        {
            return Ok( await _uow.ChatGroupRepository.GetChatGroupsByUserNameAsync(ownername));
           
        }
    }
}
