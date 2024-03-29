﻿using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper.Execution;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using System.Linq;

namespace API.Data
{
    public class ChatGroupRespository : IChatGroupRepository
    {
        private readonly DataContext _dbContext;
        private readonly IMapper _mapper;

        public ChatGroupRespository(DataContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            this._mapper = mapper;
        }

        public async Task AddChatGroupAsync(ChatGroup chatGroup)
        {
            await _dbContext.ChatGroups.AddAsync(chatGroup);
        }

        public async Task AddMemberToChatGroupAsync(int userid, int chatgroupid)
        {
            await _dbContext.ChatGroupMembers.AddAsync(new ChatGroupMember { AppUserId = userid, ChatGroupId = chatgroupid });
        }

        public async Task AddMembersToChatGroupAsync(int[] userids, int chatgroupid)
        {
            foreach (int userid in userids)
                await AddMemberToChatGroupAsync(userid,  chatgroupid );
        }

        public async Task AddMessageAsync(int senderid, int? chatgroupid, string content)
        {
            await _dbContext.ChatGroupMessages.AddAsync(new ChatGroupMessage
            {
                SenderId = senderid,
                ChatGroupId = chatgroupid,
                Content = content
            });
        }

        public async Task<ChatGroup> GetChatGroupByIdAsync(int chatgroupid)
        {
            var querable = await _dbContext.ChatGroups.FirstOrDefaultAsync(e=>e.Id == chatgroupid);
            return querable;
        }

        public async Task<ChatGroup> GetChatGroupWithConnectionsByIdAsync(int chatgroupid)
        {
            var querable = await _dbContext.ChatGroups.Include(e=>e.ChatGroupConnections)
                .FirstOrDefaultAsync(e => e.Id == chatgroupid);
            return querable;
        }

        public async Task<ChatGroup> GetChatGroupByNameAsync(string chatgroupname)
        {
            var querable = await _dbContext.ChatGroups.FirstOrDefaultAsync(e => e.Name == chatgroupname);
            return querable;
        }


        public async Task<IEnumerable<ChatGroupDto>> GetChatGroupsByUserIdAsync(int userid)
        {
           var queryable = _dbContext.ChatGroups
                .Include(e => e.Owner)
                .Include(e => e.ChatGroupMembers)
                  .ThenInclude(cgm => cgm.Member)
                  .ThenInclude(m => m.Photos)
                  .Where(e => e.OwnerId == userid 
                  || e.ChatGroupMembers.Any(e => e.AppUserId ==userid)).ProjectTo<ChatGroupDto>(_mapper.ConfigurationProvider).AsQueryable();

           return await queryable.ToArrayAsync();

        }

        public async Task<IEnumerable<ChatGroupDto>> GetChatGroupsByUserNameAsync(string username)
        {
            var queryable = _dbContext.ChatGroups.Include(e => e.ChatGroupMembers)
             .ThenInclude(cgm => cgm.Member)
             .ThenInclude(m=>m.Photos)
             .Where(e => e.Owner.UserName == username).ProjectTo<ChatGroupDto>(_mapper.ConfigurationProvider).AsQueryable();
        
            return await queryable.ToArrayAsync();

        }


        public async Task<IEnumerable<ChatGroupMember>> GetMemberByChatGroupAsync(string chatgroupName)
        {
            var querable = await _dbContext.ChatGroups.Include(e => e.ChatGroupMembers).FirstOrDefaultAsync(e => e.Name == chatgroupName);
            return querable.ChatGroupMembers;
            
        }

        public async Task<IEnumerable<AppUser>> GetMemberByChatGroupAsync(int chatgroupid)
        {
            //eager load Member's photos property as well


            var querable = _dbContext.ChatGroupMembers.Include(e => e.Member).Include(e=>e.Member.Photos).Where(e => e.ChatGroupId == chatgroupid);                                                   
            return await querable.Select(e=>e.Member).ToListAsync();
        }

        public async Task<IEnumerable<ChatGroupMessage>> GetMessageThreadAsync(int chatgroupid)
        {
            var querable = _dbContext.ChatGroupMessages.Where(e => e.ChatGroupId == chatgroupid).AsQueryable();
            return await querable.ToListAsync();
            
        }

        public Task RemoveMembersFromChatGroupAsync(int[] userids, int chatgroupid)
        {
            foreach (int userid in userids)
            {
                var querable = _dbContext.ChatGroupMembers.Where(e => e.AppUserId == userid && e.ChatGroupId == chatgroupid);
                _dbContext.ChatGroupMembers.RemoveRange(querable);
            }
            return Task.CompletedTask;

        }

        public Task UpdateChatGroupAsync(ChatGroup chatgroup)
        {
            var memberstoberemoved = _dbContext.ChatGroupMembers.Where(e=>e.ChatGroupId == chatgroup.Id);
            _dbContext.ChatGroupMembers.RemoveRange(memberstoberemoved);
            _dbContext.ChatGroupMembers.AddRange(chatgroup.ChatGroupMembers);
            //special approach to avoid duplicate key error since we are not updating the owner
            chatgroup.Owner.ChatGroupMembers = null;

            _dbContext.ChatGroups.Update(chatgroup);
            return Task.CompletedTask;
        }

        public Task DeleteChatGroupAsync(int id)
        {
            var cg = _dbContext.ChatGroups.FirstOrDefault(e => e.Id == id);
            _dbContext.ChatGroups.Remove(cg);
            return Task.CompletedTask;
        }

        public async Task<ChatGroup> GetChatGroupByConnection(string connectionId)
        {
           var querable = await _dbContext.ChatGroups.FirstOrDefaultAsync(e => e.ChatGroupConnections.Any(e => e.ConnectionId == connectionId));
           return querable;
        }

        public Task RemoveConnectionFromChatGroup(string connectionId)
        {
            var querable = _dbContext.ChatGroupConnections.Where(e => e.ConnectionId == connectionId);
            _dbContext.ChatGroupConnections.RemoveRange(querable);
            return Task.CompletedTask;
        }
    }
}
