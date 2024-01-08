namespace API.Entities
{
    public class VisitedPath
    {
        public int Id { get; set; }
        public int IpProfileId { get; set; }
        public string Path { get; set; }
        public DateTime Created { get; set; }

    }
}
