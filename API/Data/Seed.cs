using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task ClearConnections(DataContext context)
        {
            context.Connections.RemoveRange(context.Connections);
            //context.Majors.RemoveRange(context.Majors);
            //context.Universities.RemoveRange(context.Universities);
            context.ChatGroupConnections.RemoveRange(context.ChatGroupConnections);
            await context.SaveChangesAsync();
        }

        public static async Task SeedUsers(UserManager<AppUser> userManager, 
            RoleManager<AppRole> roleManager)
        {
            if (await userManager.Users.AnyAsync()) return;

            var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");

            var options = new JsonSerializerOptions{PropertyNameCaseInsensitive = true};

            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);

            var roles = new List<AppRole>
            {
                new AppRole{Name = "Member"},
                new AppRole{Name = "Admin"},
                new AppRole{Name = "Moderator"},
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            foreach (var user in users)
            {
                user.UserName = user.UserName.ToLower();
                user.Created = DateTime.SpecifyKind(user.Created, DateTimeKind.Utc);
                user.LastActive = DateTime.SpecifyKind(user.LastActive, DateTimeKind.Utc);
                await userManager.CreateAsync(user, "Pa$$w0rd");
                await userManager.AddToRoleAsync(user, "Member");
            }

            var admin = new AppUser
            {
                UserName = "admin"
            };

            await userManager.CreateAsync(admin, "Pa$$w0rd");
            await userManager.AddToRolesAsync(admin, new[] {"Admin", "Moderator"});
        }

        public static async Task SeedChatGroups(IUnitOfWork unitOfWork)
        {
            var chatgroupData = await File.ReadAllTextAsync("Data/ChatGroupSeedData.json");

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            var chatgroups = JsonSerializer.Deserialize<List<ChatGroup>>(chatgroupData);

           foreach (var chatgroup in chatgroups)
            {
                var tempgroup = await unitOfWork.ChatGroupRepository.GetChatGroupByNameAsync(chatgroup.Name);
                if (tempgroup != null) continue;
                await unitOfWork.ChatGroupRepository.AddChatGroupAsync(chatgroup);
            }
            await unitOfWork.Complete();
        }

        public static async Task SeedUniversity(IUnitOfWork unitOfWork, DataContext dataContext)
        {
            if (dataContext.Universities.Any()) return;
            var majorData = await File.ReadAllTextAsync("Data/University.json");

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            var majors = JsonSerializer.Deserialize<List<University>>(majorData, options);

            dataContext.Universities.AddRange(majors);
            await unitOfWork.Complete();
        }

        public static async Task SeedMajors(IUnitOfWork unitOfWork, DataContext dataContext)
        {
            if (dataContext.Majors.Any()) return;
            var majorData = await File.ReadAllTextAsync("Data/Majors.json");

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            var majors = JsonSerializer.Deserialize<List<Major>>(majorData, options);

             dataContext.Majors.AddRange(majors);
             await unitOfWork.Complete();
        }
    }
}