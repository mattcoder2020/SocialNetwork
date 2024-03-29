using API.Data;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using API.Middleware;
using API.SignalR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.IO.Compression;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API - V1", Version = "v1" });
    c.SwaggerDoc("metadata", new OpenApiInfo { Title = "API - MetaData", Version = "metadata" });
});


var connString = "";
var connStringIpProfile = "";
if (builder.Environment.IsDevelopment())
{ 
    connString = builder.Configuration.GetConnectionString("DefaultConnection");
    connStringIpProfile = builder.Configuration.GetConnectionString("IpProfileConnection");
}
else
{
    // Use connection string provided at runtime by FlyIO.
    var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

    // Parse connection URL to connection string for Npgsql
    connUrl = connUrl.Replace("postgres://", string.Empty);
    var pgUserPass = connUrl.Split("@")[0];
    var pgHostPortDb = connUrl.Split("@")[1];
    var pgHostPort = pgHostPortDb.Split("/")[0];
    var pgDb = pgHostPortDb.Split("/")[1];
    var pgUser = pgUserPass.Split(":")[0];
    var pgPass = pgUserPass.Split(":")[1];
    var pgHost = pgHostPort.Split(":")[0];
    var pgPort = pgHostPort.Split(":")[1];

    connString = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};";
}
builder.Services.AddDbContext<DataContext>(opt =>
{
    opt.UseNpgsql(connString);
});

builder.Services.AddDbContext<DataContextIpProfile>(opt =>
{
    opt.UseNpgsql(connStringIpProfile);
});
builder.Services.AddMemoryCache();

builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true; // Enable compression for HTTPS requests
    options.Providers.Add<GzipCompressionProvider>(); // Enable Gzip compression
                                                      //options.Providers.Add<BrotliCompressionProvider>(); // Enable Brotli compression
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();

});

builder.Services.Configure<BrotliCompressionProviderOptions>(options =>
{
    options.Level = CompressionLevel.Fastest;
});

builder.Services.Configure<GzipCompressionProviderOptions>(options =>
{
    options.Level = CompressionLevel.Fastest;
});

var app = builder.Build();
app.UseResponseCompression();
// Configure the HTTP request pipeline.
//app.UseMiddleware<IpProfileMiddleware>();
app.UseMiddleware<ExceptionMiddleware>();

app.UseCors(builder => builder
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
    .WithOrigins("https://localhost:4200"));

app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseSwagger();
//app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
//app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v2/swagger.json", "API - V2"));

app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "V1 Docs");
    c.SwaggerEndpoint("/swagger/metadata/swagger.json", "MetaData Docs");
});

app.MapControllers();
app.MapHub<PresenceHub>("hubs/presence");
app.MapHub<MessageHub>("hubs/message");
app.MapFallbackToController("Index", "Fallback");

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    var uowManager = services.GetRequiredService<IUnitOfWork>();

    await context.Database.MigrateAsync();
    await Seed.ClearConnections(context);
    await Seed.SeedMajors(uowManager, context);
    await Seed.SeedUniversity(uowManager, context);
    await Seed.SeedOccupations(uowManager, context);
    await Seed.SeedUsers(userManager, roleManager);
    await Seed.SeedChatGroups(uowManager);
}
catch (Exception ex)
{
    var logger = services.GetService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}

app.Run();

//remove db records during application exit


