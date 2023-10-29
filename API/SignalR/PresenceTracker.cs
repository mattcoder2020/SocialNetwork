using API.Entities;

namespace API.SignalR
{
    public class PresenceTracker
    {
        private static readonly Dictionary<string, List<string>> OnlineUsers = 
            new Dictionary<string, List<string>>();

        private static readonly IList<Connection> UserConnections =
           new List<Connection>();

        public Task<bool> UserConnected(string username, string connectionId)
        {
            //in scenario using a secondary device to connect (with different connectionId) for the same user, return false
            bool isOnline = false;
            lock(OnlineUsers)
            {
                if (OnlineUsers.ContainsKey(username))
                {
                    OnlineUsers[username].Add(connectionId);
                }
                else 
                {
                    OnlineUsers.Add(username, new List<string>{connectionId});
                    isOnline = true;
                }
            }

            lock(UserConnections)
            {
                var connection = new Connection { Username = username, ConnectionId = connectionId };
                if (!UserConnections.Contains(connection))
                {
                    UserConnections.Add(connection);
                }
              
            }
            return Task.FromResult(isOnline);
        }

        public Task<bool> UserDisconnected(string username, string connectionId)
        {
            bool isOffline = false;

            lock(OnlineUsers)
            {
                if (!OnlineUsers.ContainsKey(username)) return Task.FromResult(isOffline);

                OnlineUsers[username].Remove(connectionId);

                if (OnlineUsers[username].Count == 0)
                {
                    OnlineUsers.Remove(username);
                    isOffline = true;
                }
            }

            lock (UserConnections)
            {
                var connection = new Connection { Username = username, ConnectionId = connectionId };
                if (UserConnections.Contains(connection))
                {
                    UserConnections.Remove(connection);
                }

            }

            return Task.FromResult(isOffline);
        }

        public Task<string[]> GetOnlineUsers()
        {
            string[] onlineUsers;
            lock(OnlineUsers)
            {
                onlineUsers = OnlineUsers.OrderBy(k => k.Key).Select(k => k.Key).ToArray();
            }

            return Task.FromResult(onlineUsers);
        }

        public static Task<string[]> GetChatGroupConnectionsByUsers(IEnumerable<AppUser> members)
        {
            List<string> connectionIds = new List<string>();

            lock (OnlineUsers)
            {
                foreach(AppUser user in members)
                {
                    if (OnlineUsers.ContainsKey(user.UserName))
                    {
                        connectionIds.AddRange(OnlineUsers[user.UserName]);
                    }
                }
            }

            return Task.FromResult(connectionIds.ToArray<string>());
        }

        public static Task<List<string>> GetConnectionsForUser(string username)
        {
            List<string> connectionIds;

            lock (OnlineUsers)
            {
                connectionIds = OnlineUsers.GetValueOrDefault(username);
            }

            return Task.FromResult(connectionIds);
        }
    }
}