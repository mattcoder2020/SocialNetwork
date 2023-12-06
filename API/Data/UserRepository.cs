using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using CloudinaryDotNet;
using Microsoft.EntityFrameworkCore;
using System.Linq;

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
            if (userParams.GenderList != null && (userParams.GenderList.Count > 0))
            {
                query = query.Where(u =>
                (
                  (userParams.GenderList.Contains("male")) && (u.Gender == "male") ||
                  (userParams.GenderList.Contains("female")) && (u.Gender == "female"))
                );
            }
            var tempYearList = userParams.YearRangeList;

            if (tempYearList.Count() > 0)
            {
                query = query.Where(u =>
                (
                    (tempYearList.Contains(1980) && (u.YearOfGraduate > new DateTime(1980, 1, 1).ToUniversalTime() && u.YearOfGraduate < new DateTime(1989, 12, 30).ToUniversalTime())) ||
                    (tempYearList.Contains(1990) && (u.YearOfGraduate > new DateTime(1990, 1, 1).ToUniversalTime() && u.YearOfGraduate < new DateTime(1999, 12, 30).ToUniversalTime())) ||
                    (tempYearList.Contains(2000) && (u.YearOfGraduate > new DateTime(2000, 1, 1).ToUniversalTime() && u.YearOfGraduate < new DateTime(2009, 12, 30).ToUniversalTime())) ||
                    (tempYearList.Contains(2010) && (u.YearOfGraduate > new DateTime(2010, 1, 1).ToUniversalTime() && u.YearOfGraduate < new DateTime(2019, 12, 30).ToUniversalTime())) ||
                    (tempYearList.Contains(2020) && (u.YearOfGraduate > new DateTime(2020, 1, 1).ToUniversalTime() && u.YearOfGraduate < new DateTime(2029, 12, 30).ToUniversalTime()))
                )
                );
            }

            if (userParams.MajorList!= null && (userParams.MajorList.Count > 0))
            {
                query = query.Where(u =>
                (
                    (userParams.MajorList.Contains(1)) && (u.MajorId == 1) ||
                    (userParams.MajorList.Contains(2)) && (u.MajorId == 2) ||
                    (userParams.MajorList.Contains(3)) && (u.MajorId == 3) ||
                    (userParams.MajorList.Contains(4)) && (u.MajorId == 4) ||
                    (userParams.MajorList.Contains(5)) && (u.MajorId == 5) 
                )
                );
            }

            if (userParams.UniversityList != null && (userParams.UniversityList.Count > 0))
            {
                query = query.Where(u =>
               (
                   (userParams.UniversityList.Contains(1)) && (u.UniversityId == 1) ||
                   (userParams.UniversityList.Contains(2)) && (u.UniversityId == 2) ||
                   (userParams.UniversityList.Contains(3)) && (u.UniversityId == 3) ||
                   (userParams.UniversityList.Contains(4)) && (u.UniversityId == 4) ||
                   (userParams.UniversityList.Contains(5)) && (u.UniversityId == 5)
               )
               );
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