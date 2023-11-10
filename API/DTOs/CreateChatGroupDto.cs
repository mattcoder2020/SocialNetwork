using API.Entities;

namespace API.DTOs
{
    public class CreateChatGroupDto
    {
        
        public string Name { get; set; }
        public int OwnerId { get; set; }
        public List<ChatGroupMember> ChatGroupMembers { get; set; }
    }
}
