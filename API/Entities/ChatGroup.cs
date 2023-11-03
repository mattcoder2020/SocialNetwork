﻿namespace API.Entities
{
    public class ChatGroup
    {
        public ChatGroup()
        {}
        public ChatGroup(string name, AppUser owner)
        {
            Name = name;
            Owner = owner;
        }
        public int Id { get; set; }
        public string Name { get; set; }
        public int OwnerId { get; set; }
        public AppUser Owner { get; set; }
        public List<ChatGroupMember> ChatGroupMembers { get; set; } 

    }
}
