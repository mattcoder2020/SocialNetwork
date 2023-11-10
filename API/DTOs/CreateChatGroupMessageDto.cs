namespace API.DTOs
{
    public class CreateChatGroupMessageDto
    {
        public int chatgroupid { get; set; }
        public int senderid { get; set; }
        public string chatgroupname { get; set; }
        public string Content { get; set; }
    }
}