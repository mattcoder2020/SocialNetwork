using System.Text.Json.Serialization;

namespace API.Entities
{
    public class ChatGroupMessage
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int? ChatGroupId { get; set; }
        public string Content { get; set; }

        // ignore this in json response

        [JsonIgnore]
        public ChatGroup ChatGroup { get; set; }
        public DateTime MessageSent { get; set; } = DateTime.UtcNow;
    }
}