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
            _dbContext.ch
        }

        public async Task AddMessageAsync(ChatGroupMessage message)
        {
            throw new NotImplementedException();
        }

        public async Task<ChatGroup> GetChatGroupByNameAsync(string chatgroupName)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<AppUser>> GetMemberByChatGroupAsync(string chatgroupName)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<ChatGroupMessage>> GetMessageThreadAsync(string chatgroup)
        {
            throw new NotImplementedException();
        }
    }
}
