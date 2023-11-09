using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IChatGroupRepository
    {
        Task<IEnumerable<ChatGroup>> GetChatGroupsByUserIdAsync(int userid);
        Task<IEnumerable<ChatGroupDto>> GetChatGroupsByUserNameAsync(string username);
        Task<ChatGroup> GetChatGroupByIdAsync(int chatgroupid);
        Task<IEnumerable<ChatGroupMessage>> GetMessageThreadAsync(int chatgroupid);
        Task<IEnumerable<AppUser>> GetMemberByChatGroupAsync(int chatgroupid);
        Task AddChatGroupAsync(ChatGroup chatGroup);
        Task AddMessageAsync(int senderid, int chatgroupid, string content);
        Task AddMemberToChatGroupAsync(int userid, int chatgroupid);
        Task AddMembersToChatGroupAsync(int[] userids, int chatgroupid);
        Task RemoveMembersFromChatGroupAsync(int[] userids, int chatgroupid);
        Task UpdateChatGroupAsync(ChatGroup chatgroup);
    }
}