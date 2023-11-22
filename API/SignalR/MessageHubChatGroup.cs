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
        /// <summary>
        /// Subscribe to a chat group with 2 or more members and register the client functions and lastly 
        /// retrieve the messages base on the same group.
        /// </summary>
        /// <param name="chatgroupName">Name of the chat group</param>
        /// <returns></returns>
        public async Task SubscribeToChatGroupByGroupName(int chatgroupid)
        {
            var httpContext = Context.GetHttpContext();

            //var groupName = GetGroupName(Context.User.GetUsername(), createPrivateGroupDto.OtherUser);

            ////Add the connection to the 2 people SignalR group
            //await Groups.AddToGroupAsync(Context.ConnectionId, chatgroupid.ToString());

            var group = await AddConnectionToChatGroup(chatgroupid);

            //await Clients.Group(chatgroupName).SendAsync("UpdatedChatGroupName", chatgroupName);

            var messages = await _uow.ChatGroupRepository.GetMessageThreadAsync(chatgroupid);

            await Clients.Caller.SendAsync("ReceiveChatGroupMessageThread", messages);

        }

        /// <summary>
        /// Persist the current user / current chatgroup relation to the database.
        /// if group is not exist, persist the connection to the group
        /// so that when group member send message, the message will be sent to all the group member
        /// </summary>
        /// <param name="groupName"></param>
        /// <returns></returns>
        /// <exception cref="HubException"></exception>
        private async Task<ChatGroup> AddConnectionToChatGroup(int chatgroupid)
        {
            var group = await _uow.ChatGroupRepository.GetChatGroupByIdAsync(chatgroupid);
            var connection = new ChatGroupConnection(Context.ConnectionId, chatgroupid, Context.User.GetUsername());


            group.ChatGroupConnections.Add(connection);

            if (await _uow.Complete()) return group;

            throw new HubException("Failed to add to group");
        }

        private async Task<ChatGroup> RemoveConnectionFromChatGroup()
        {
            var group = await _uow.ChatGroupRepository.GetChatGroupByConnection(Context.ConnectionId);
            if (group != null)
            {
                await _uow.ChatGroupRepository.RemoveConnectionFromChatGroup(Context.ConnectionId);
            }


            if (await _uow.Complete()) return group;

            throw new HubException("Failed to remove connection from chat group");
        }

        public async Task SendMessageToChatGroup(CreateChatGroupMessageDto createMessageDto)
        {
            var username = Context.User.GetUsername();

            var sender = await _uow.UserRepository.GetUserByUsernameAsync(username);
            if (sender == null) throw new HubException("Message sender not found");

            var chatgroup = await _uow.ChatGroupRepository.GetChatGroupByIdAsync(createMessageDto.chatgroupid);
            if (chatgroup == null) throw new HubException("Chat group not found");


            var message = new ChatGroupMessage
            {
                ChatGroupId = chatgroup.Id,
                SenderId = sender.Id,
                Content = createMessageDto.Content
            };

            var members = await _uow.ChatGroupRepository.GetMemberByChatGroupAsync(createMessageDto.chatgroupid);


            var connections = await PresenceTracker.GetChatGroupConnectionsByUsers(members);
            if (connections != null)
            {
                //await _presenceHub.Clients.Clients(connections).SendAsync("NewChatGroupMessageReceived",
                //    new { username = sender.UserName, chatgroup = createMessageDto.chatgroupid});
                await _presenceHub.Clients.Clients(connections).SendAsync("NewChatGroupMessage",
                   message);

                foreach (var connection in connections)
                    await Groups.AddToGroupAsync(connection, createMessageDto.chatgroupid.ToString());
            }


            await _uow.ChatGroupRepository.AddMessageAsync(message.SenderId, message.ChatGroupId, message.Content);

            if (await _uow.Complete())
            {
                await Clients.Group(createMessageDto.chatgroupid.ToString()).SendAsync("NewChatGroupMessage", message);
            }
        }

    }
}