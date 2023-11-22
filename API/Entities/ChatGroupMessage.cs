namespace API.Entities
{
    public class ChatGroupMessage
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int? ChatGroupId { get; set; }
        public string Content { get; set; }
        public DateTime MessageSent { get; set; } = DateTime.UtcNow;
    }
}