using API.Entities;
using Microsoft.Extensions.Primitives;
using System.Collections;

namespace API.Interfaces
{
    public interface IChatGroupMessageRepository
    {
        Task AddMessageAsync(ChatGroupMessage message);
        Task<IEnumerable<ChatGroupMessage>> GetMessageThreadAsync(String chatgroup);
    }
}