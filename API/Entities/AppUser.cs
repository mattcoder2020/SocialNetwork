using API.Extensions;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser<int>
    {
        public DateOnly DateOfBirth { get; set; }
        public string KnownAs { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public DateTime LastActive { get; set; } = DateTime.UtcNow;
        public DateTime YearOfGraduate { get; set; } = DateTime.UtcNow;
        public string Gender { get; set; }
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }

        public University University { get; set; }
        public Major Major { get; set; }
        public Occupation Occupation { get; set; }

        public int OccupationId { get; set; }
        public int MajorId { get; set; }
        public int UniversityId { get; set; }

        public List<Photo> Photos { get; set; } = new();
        public List<UserLike> LikedByUsers { get; set; }
        public List<UserLike> LikedUsers { get; set; }
        public List<Message> MessagesSent { get; set; }
        public List<Message> MessagesReceived { get; set; }
        public List<ChatGroupMember> ChatGroupMembers { get; set; }
        public ICollection<AppUserRole> UserRoles { get; set; }
    }

    public class University : Entity
    {
        public string Name { get; set; }
    }

    public class Major : Entity
    {
        public string Name { get; set; }
    }

    public class Occupation : Entity
    {
        public string Name { get; set; }
    }
}


   
