using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IChatGroupRepository
    {
        Task<IEnumerable<ChatGroupDto>> GetChatGroupsByUserIdAsync(int userid);
        Task<IEnumerable<ChatGroupDto>> GetChatGroupsByUserNameAsync(string username);
        Task<ChatGroup> GetChatGroupByIdAsync(int chatgroupid);
        Task<ChatGroup> GetChatGroupByConnection(string connectionId);
        Task<ChatGroup> GetChatGroupWithConnectionsByIdAsync(int chatgroupid);
        Task<ChatGroup> GetChatGroupByNameAsync(string chatgroupname);
        Task<IEnumerable<ChatGroupMessage>> GetMessageThreadAsync(int chatgroupid);
        Task<IEnumerable<AppUser>> GetMemberByChatGroupAsync(int chatgroupid);
        Task AddChatGroupAsync(ChatGroup chatGroup);
        Task AddMessageAsync(int senderid, int? chatgroupid, string content);
        Task AddMemberToChatGroupAsync(int userid, int chatgroupid);
        Task AddMembersToChatGroupAsync(int[] userids, int chatgroupid);
        Task RemoveMembersFromChatGroupAsync(int[] userids, int chatgroupid);
        Task RemoveConnectionFromChatGroup(string connectionId);
        Task UpdateChatGroupAsync(ChatGroup chatgroup);
        Task DeleteChatGroupAsync(int id);
        
    }
}