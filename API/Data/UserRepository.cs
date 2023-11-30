using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public UserRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<MemberDto> GetMemberAsync(string username)
        {
            return await _context.Users
                .Where(x => x.UserName == username)
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
            var query = _context.Users.AsQueryable();

            query = query.Where(u => u.UserName != userParams.CurrentUsername);
            if (!string.IsNullOrEmpty(userParams.Gender))
            {
                query = query.Where(u => u.Gender == userParams.Gender);
            }

            if (userParams.YearRangeList != null && (userParams.YearRangeList.Count > 0))
            {
                foreach (int year in userParams.YearRangeList)
                {
                    if (year == 1980)
                    {
                        query = query.Where(u => u.YearOfGraduate > new DateTime(1960, 1 ,1) && u.YearOfGraduate < new DateTime(1969, 12, 30));
                    }
                    if (year == 1990)
                    {
                        query = query.Where(u => u.YearOfGraduate > new DateTime(1990, 1, 1) && u.YearOfGraduate < new DateTime(1999, 12, 30));
                    }
                    if (year == 2000)
                    {
                        query = query.Where(u => u.YearOfGraduate > new DateTime(2000, 1, 1) && u.YearOfGraduate < new DateTime(2009, 12, 30));
                    }
                    if (year == 2010)
                    {
                        query = query.Where(u => u.YearOfGraduate > new DateTime(2010, 1, 1) && u.YearOfGraduate < new DateTime(2019, 12, 30));
                    }
                    if (year == 2020)
                    {
                        query = query.Where(u => u.YearOfGraduate > new DateTime(2020, 1, 1) && u.YearOfGraduate < new DateTime(2029, 12, 30));
                    }
                }
            }

            if (userParams.MajorList!= null && (userParams.MajorList.Count > 0))
            {
                foreach (MajorEnum major in userParams.MajorList)
                {  
                        query = query.Where(u => u.MajorId== (int)(major));
                }
            }

            if (userParams.UniversityList != null && (userParams.UniversityList.Count > 0))
            {
                foreach (UniversityEnum university in userParams.UniversityList)
                {
                    query = query.Where(u => u.UniversityId == (int)(university));
                }
            }


            var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MaxAge - 1));
            var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MinAge));

            query = query.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);

            query = userParams.OrderBy switch
            {
                "created" => query.OrderByDescending(u => u.Created),
                _ => query.OrderByDescending(u => u.LastActive)
            };

            return await PagedList<MemberDto>.CreateAsync(
                query.AsNoTracking().ProjectTo<MemberDto>(_mapper.ConfigurationProvider), 
                userParams.PageNumber, 
                userParams.PageSize);

        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users
                .Include(p => p.Photos)
                .ToListAsync();
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }
    }
}