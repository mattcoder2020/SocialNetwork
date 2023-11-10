using API.Entities;

namespace API.DTOs
{
    public class ChatGroupMemberDto
    {
        public int AppUserId { get; set; }
        public int ChatGroupId { get; set; }
    }
}
