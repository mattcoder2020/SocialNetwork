using API.Entities;

namespace API.DTOs
{
    public class ChatGroupDto
    {         
            public int Id { get; set; }
            public string Name { get; set; }
            public int OwnerId { get; set; }
            public AppUser Owner { get; set; }

           

    }
}
