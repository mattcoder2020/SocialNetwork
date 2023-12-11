using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.RazorPages.Infrastructure;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; }

        [Required] public string KnownAs { get; set; }
        [Required] public string Gender { get; set; }
        [Required] public DateOnly? DateOfBirth { get; set; } // optional to make required work!
        [Required] public string City { get; set; }
        [Required] public string Country { get; set; }
        [Required] public int MajorId { get; set; }
        [Required] public int UniversityId { get; set; }
        [Required] public int OccupationId { get; set; }
        [Required] public DateTime? YearOfGraduate { get; set; }


        [Required]
        [StringLength(8, MinimumLength = 4)]
        public string Password { get; set; }
    }
}