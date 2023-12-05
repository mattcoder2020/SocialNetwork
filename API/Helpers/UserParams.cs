using API.Entities;

namespace API.Helpers
{
    public class UserParams : PaginationParams
    {
        public string CurrentUsername { get; set; }
        public string Gender { get; set; }
       
        public int MinAge { get; set; } = 18;
        public int MaxAge { get; set; } = 100;
        public string OrderBy { get; set; } = "lastActive";
        public List<int> UniversityList { get; set; }
        public List<int> MajorList { get; set; }
        public List<int> YearRangeList { get; set; }
        public List<string> GenderList { get; set; }
    }
}