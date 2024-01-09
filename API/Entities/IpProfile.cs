namespace API.Entities
{
    public class IpProfile
    {
        public int Id { get; set; }
        public string IpAddress { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
    }
}
