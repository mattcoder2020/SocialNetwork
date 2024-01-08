using System.Net;
using System.Text.Json;
using API.Data;
using API.Errors;
using API.Interfaces;
using Microsoft.AspNetCore.Http;

namespace API.Middleware
{
    public class IpProfileMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;
        private IIpProfileRepoistory ipProfileRepoistory;

        public IpProfileMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, 
            IHostEnvironment env)
        {
            _env = env;
            _logger = logger;
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                this.ipProfileRepoistory = context.RequestServices.GetRequiredService<IIpProfileRepoistory>();

               // await ipProfileRepoistory.AddIpProfileAsync(context.Connection.RemoteIpAddress.ToString());
                await ipProfileRepoistory.AddIpProfileAsync("119.137.2.96");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                
            }
            await _next(context);
        }
    }
}