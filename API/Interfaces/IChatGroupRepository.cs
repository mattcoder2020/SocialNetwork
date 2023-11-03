using API.Entities;

namespace API.Interfaces
{
    public interface IChatGroupRepository
    {
        Task<ChatGroup> GetChatGroupByNameAsync(string chatgroupName);
        Task<ChatGroup> GetChatGroupByIdAsync(int chatgroupid);
        Task AddChatGroup(ChatGroup chatGroup);
        Task AddMessageAsync(int senderid, int chatgroupid, string content);
        Task<List<ChatGroupMessage>> GetMessageThreadAsync(int chatgroupid);
        Task<List<ChatGroupMember>> GetMemberByChatGroupAsync(int chatgroupid);
        Task AddMemberToChatGroupAsync(int userid, int chatgroupid);
    }
}