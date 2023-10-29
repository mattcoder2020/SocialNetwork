using API.Entities;

namespace API.Interfaces
{
    public interface IChatGroupRepository
    {
        Task<ChatGroup> GetChatGroupByNameAsync(string chatgroupName);
    }
}