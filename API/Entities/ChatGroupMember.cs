namespace API.Entities
{
    public class ChatGroupMember
    {
        public AppUser Member { get; set; }
        public int AppUserId { get; set; }
        public ChatGroup ChatGroup { get; set; }
        public int ChatGroupId { get; set; }
    }
}
