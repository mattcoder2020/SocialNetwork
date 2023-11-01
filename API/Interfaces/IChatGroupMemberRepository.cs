using API.Entities;

namespace API.Interfaces
{
    public interface IChatGroupMemberRepository
    {
        Task<IEnumerable<AppUser>> GetMemberByChatGroupAsync(int chatgroupid);
        Task AddMemberToChatGroupAsync(int userid, int chatgroupid);
    }
}