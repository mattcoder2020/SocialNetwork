using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;

namespace API.SignalR
{
    [Authorize]
    public partial class MessageHub : Hub
    {
        private readonly IMapper _mapper;
        private readonly IHubContext<PresenceHub> _presenceHub;
        private readonly IUnitOfWork _uow;
        public MessageHub(IUnitOfWork uow, IMapper mapper, IHubContext<PresenceHub> presenceHub)
        {
            _uow = uow;
            _presenceHub = presenceHub;
            _mapper = mapper;
        }

        public override async Task OnConnectedAsync()
        {            
           await base.OnConnectedAsync();
        }

        /// <summary>
        /// Register a group between 2 users and add the connection to the group, then 
        /// send the updated group to the caller with the messages base on the same group.
        /// </summary>
        /// <param name="createPrivateGroupDto"></param>
        /// <returns></returns>
        public async Task CreatePrivateGroupByOtherUser(CreatePrivateGroupDto createPrivateGroupDto)
        {
            var httpContext = Context.GetHttpContext();
           
            var groupName = GetGroupName(Context.User.GetUsername(), createPrivateGroupDto.OtherUser);

            //Add the connection to the 2 people SignalR group
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            //add the connection to the database
            var group = await AddConnectionToGroup(groupName);

            await Clients.Group(groupName).SendAsync("UpdatedGroup", group);

            var messages = await _uow.MessageRepository
                .GetMessageThread(Context.User.GetUsername(), createPrivateGroupDto.OtherUser);

            var changes = _uow.HasChanges();

            if (_uow.HasChanges()) await _uow.Complete();

            await Clients.Caller.SendAsync("ReceiveMessageThread", messages);

        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var group = await RemoveConnectionFromMessageGroup();
            if (group != null)
            {
                await Clients.Group(group.Name).SendAsync("UpdatedGroup");
            }
            var group2 = await RemoveConnectionFromChatGroup();
            if (group2 != null)
            {
                await Clients.Group(group2.Id.ToString()).SendAsync("UpdatedGroup");
            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
            var username = Context.User.GetUsername();

            if (username == createMessageDto.RecipientUsername.ToLower())
                throw new HubException("You cannot send messages to yourself");

            var sender = await _uow.UserRepository.GetUserByUsernameAsync(username);
            var recipient = await _uow.UserRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

            if (recipient == null) throw new HubException("Not found user");

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };

            var groupName = GetGroupName(sender.UserName, recipient.UserName);

            var group = await _uow.MessageRepository.GetMessageGroup(groupName);

            if (group.Connections.Any(x => x.Username == recipient.UserName))
            {
                message.DateRead = DateTime.UtcNow;
            }
            else
            {
                var connections = await PresenceTracker.GetConnectionsForUser(recipient.UserName);
                if (connections != null)
                {
                    await _presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived",
                        new {username = sender.UserName, knownAs = sender.KnownAs});
                }
            }

            _uow.MessageRepository.AddMessage(message);

            if (await _uow.Complete())
            {
                await Clients.Group(groupName).SendAsync("NewMessage", _mapper.Map<MessageDto>(message));
            }
        }

        
        /// <summary>
        /// Calculate the 2 people group name base on the current user and the target user
        /// </summary>
        /// <param name="caller">current user</param>
        /// <param name="other">target user</param>
        /// <returns></returns>
        private string GetGroupName(string caller, string other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }

        /// <summary>
        /// Persist the current user / current 2 people group  relation to the database.
        /// if group is not exist, persist the connection to the group
        /// so that when group member send message, the message will be sent to all the group member
        /// </summary>
        /// <param name="groupName"></param>
        /// <returns></returns>
        /// <exception cref="HubException"></exception>
        private async Task<Group> AddConnectionToGroup(string groupName)
        {
            var group = await _uow.MessageRepository.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId, Context.User.GetUsername());

            
            if (group == null)
            {
                group = new Group(groupName);
                _uow.MessageRepository.AddGroup(group);
            }

            group.Connections.Add(connection);

            if (await _uow.Complete()) return group;

            throw new HubException("Failed to add to group");
        }

        private async Task<Group> RemoveConnectionFromMessageGroup()
        {
            var group = await _uow.MessageRepository.GetGroupForConnection(Context.ConnectionId);
            if (group !=null )
            {
                _uow.MessageRepository.RemoveConnection(group.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId));
            }
          

            if (await _uow.Complete()) return group;

            throw new HubException("Failed to remove from group");
        }
    }
}