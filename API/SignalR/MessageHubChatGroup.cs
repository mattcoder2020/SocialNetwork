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
        public async Task SubscribeToChatGroupByGroupName(string chatgroupName)
        {
            var httpContext = Context.GetHttpContext();

            //var groupName = GetGroupName(Context.User.GetUsername(), createPrivateGroupDto.OtherUser);

            ////Add the connection to the 2 people SignalR group
            //await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            //var group = await AddToGroup(groupName);

            await Clients.Group(chatgroupName).SendAsync("UpdatedChatGroupName", chatgroupName);

            var messages = await _uow.ChatGroupMessageRepository.GetMessageThreadAsync(chatgroupName);

            var changes = _uow.HasChanges();

            if (_uow.HasChanges()) await _uow.Complete();

            await Clients.Caller.SendAsync("ReceiveChatGroupMessageThread", messages);

        }

        public async Task SendMessageToChatGroup(CreateChatGroupMessageDto createMessageDto)
        {
            var username = Context.User.GetUsername();

            var sender = await _uow.UserRepository.GetUserByUsernameAsync(username);
            if (sender == null) throw new HubException("Message sender not found");

            var chatgroup = await _uow.ChatGroupRepository.GetChatGroupByNameAsync(createMessageDto.ChatgroupName);
            if (chatgroup == null) throw new HubException("Chat group not found");


            var message = new ChatGroupMessage
            {
                Sender = sender,
                ChatgroupName = createMessageDto.ChatgroupName,
                Content = createMessageDto.Content
            };

            var members = await _uow.ChatGroupMemberRepository.GetMemberByChatGroupAsync(createMessageDto.ChatgroupName);


            var connections = await PresenceTracker.GetChatGroupConnectionsByUsers(members);
            if (connections != null)
            {
                //await _presenceHub.Clients.Clients(connections).SendAsync("NewChatGroupMessageReceived",
                //    new { username = sender.UserName, chatgroup = createMessageDto.ChatgroupName });
                await _presenceHub.Clients.Clients(connections).SendAsync("NewChatGroupMessageReceived",
                    new { username = sender.UserName, chatgroup = createMessageDto.ChatgroupName });

                foreach (var connection in connections)
                    await Groups.AddToGroupAsync(connection, createMessageDto.ChatgroupName);
            }


            await _uow.ChatGroupMessageRepository.AddMessageAsync(message);

            if (await _uow.Complete())
            {
                await Clients.Group(createMessageDto.ChatgroupName).SendAsync("NewChatGroupMessage", _mapper.Map<MessageDto>(message));
            }
        }

    }
}