namespace API.DTOs
{
    public class LikeDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public int Age { get; set; }
        public string KnownAs { get; set; }
        public string PhotoUrl { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public DateTime LastActive { get; internal set; }
        public int UniversityId { get; internal set; }
        public int MajorId { get; internal set; }
    }
}