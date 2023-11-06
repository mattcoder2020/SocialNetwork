using API.Entities;

namespace API.Interfaces
{
    public interface IChatGroupRepository
    {
        Task<ChatGroup> GetChatGroupByNameAsync(string chatgroupName);
        Task<IEnumerable<ChatGroup>> GetChatGroupsByUserIdAsync(int userid);
        Task<ChatGroup> GetChatGroupByIdAsync(int chatgroupid);
        Task<IEnumerable<ChatGroupMessage>> GetMessageThreadAsync(int chatgroupid);
        Task<IEnumerable<AppUser>> GetMemberByChatGroupAsync(int chatgroupid);
        Task AddChatGroup(ChatGroup chatGroup);
        Task AddMessageAsync(int senderid, int chatgroupid, string content);
        Task AddMemberToChatGroupAsync(int userid, int chatgroupid);
    }
}