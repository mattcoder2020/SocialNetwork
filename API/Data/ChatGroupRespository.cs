using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class ChatGroupRespository : IChatGroupMemberRepository, IChatGroupMessageRepository, IChatGroupRepository
    {
        private readonly DataContext _dbContext;

        public ChatGroupRespository(DataContext dbContext)
        {
            _dbContext = dbContext;
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

        public async Task<ChatGroup> GetChatGroupByNameAsync(string chatgroupName)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<AppUser>> GetMemberByChatGroupAsync(string chatgroupName)
        {
            var querable = _dbContext.ChatGroups.Include(e => e.ChatGroupMembers).FirstOrDefaultAsync(e => e.Name == chatgroupName);
            return querable.Result.ChatGroupMembers;
            
        }

        public Task<IEnumerable<AppUser>> GetMemberByChatGroupAsync(int chatgroupid)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<ChatGroupMessage>> GetMessageThreadAsync(string chatgroup)
        {
            throw new NotImplementedException();
        }
    }
}
