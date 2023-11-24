namespace API.Entities
{
    public class ChatGroupConnection
    {
        public ChatGroupConnection() { }
        public ChatGroupConnection(string connectionId, int chatgroupid, string username)
        {
            ConnectionId = connectionId;
            ChatGroupId = chatgroupid;
            UserName = username;

        }

        public ChatGroup ChatGroup { get; private set; }
        public string ConnectionId { get; private set; }
        public int ChatGroupId { get; private set; }
        public string UserName { get; private set;}
    }
}
