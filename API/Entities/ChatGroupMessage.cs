namespace API.Entities
{
    public class ChatGroupMessage
    {
        public int Id { get; set; }
        public AppUser Sender { get; set; }
        public string ChatgroupName { get; set; }
        public object Content { get; set; }
    }
}