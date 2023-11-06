using API.Entities;
using API.Interfaces;
using AutoMapper.Execution;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class ChatGroupRespository : IChatGroupRepository
    {
        private readonly DataContext _dbContext;

        public ChatGroupRespository(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddChatGroup(ChatGroup chatGroup)
        {
            await _dbContext.ChatGroups.AddAsync(chatGroup);
        }

        public async Task AddMemberToChatGroupAsync(int userid, int chatgroupid)
        {
            await _dbContext.ChatGroupMembers.AddAsync(new ChatGroupMember { AppUserId = userid, ChatGroupId = chatgroupid });
        }

        public async Task AddMessageAsync(int senderid, int chatgroupid, string content)
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

        public async Task<ChatGroup> GetChatGroupByNameAsync(string chatgroupName)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<ChatGroup>> GetChatGroupsByUserIdAsync(int userid)
        {
            var querable =  _dbContext.ChatGroups.Where(e => e.OwnerId == userid).AsQueryable();
            return await querable.ToArrayAsync();
            
        }

        public async Task<IEnumerable<ChatGroupMember>> GetMemberByChatGroupAsync(string chatgroupName)
        {
            var querable = await _dbContext.ChatGroups.Include(e => e.ChatGroupMembers).FirstOrDefaultAsync(e => e.Name == chatgroupName);
            return querable.ChatGroupMembers;
            
        }

        public async Task<IEnumerable<AppUser>> GetMemberByChatGroupAsync(int chatgroupid)
        {
            var querable = _dbContext.ChatGroupMembers.Include(e => e.Member).Where(e => e.ChatGroupId == chatgroupid);                                                   .SelectMany(e => e.ChatGroupId == chatgroupid);
            return await querable.Select(e=>e.Member).ToListAsync();
        }

        public async Task<IEnumerable<ChatGroupMessage>> GetMessageThreadAsync(int chatgroupid)
        {
            var querable = _dbContext.ChatGroupMessages.Where(e => e.ChatGroupId == chatgroupid).AsQueryable();
            return await querable.ToListAsync();
            
        }


        
    }
}
