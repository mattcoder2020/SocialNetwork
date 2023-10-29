using API.Entities;

namespace API.Interfaces
{
    public interface IChatGroupMemberRepository
    {
        Task<IEnumerable<AppUser>> GetMemberByChatGroupAsync(string chatgroupName);
        Task AddMemberToChatGroupAsync(AppUser user);
    }
}