namespace API.DTOs
{
    public class CreateMessageDto
    {
        public string RecipientUsername { get; set; }
        public string Content { get; set; }
    }

    public class CreatePrivateGroupDto
    {
        public string OtherUser { get; set; }
    }
}