using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers
{
    public class VisitorIpAndActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            try
            {
                var ipProfileRepoistory = resultContext.HttpContext.RequestServices.GetRequiredService<IIpProfileRepoistory>();
                var VisitorPathRepoistory = resultContext.HttpContext.RequestServices.GetRequiredService<IVisitorPathRepository>();

                // await ipProfileRepoistory.AddIpProfileAsync(context.Connection.RemoteIpAddress.ToString());
                var ipProfile = await ipProfileRepoistory.AddIpProfileAsync(context.HttpContext.Connection.RemoteIpAddress.ToString());
                var visitorPath = new VisitedPath();
                var httpVerb = context.HttpContext.Request.Method;

                // Get request URL
                var requestUrl = $"{context.HttpContext.Request.Scheme}://{context.HttpContext.Request.Host}{context.HttpContext.Request.Path}{context.HttpContext.Request.QueryString}";

                visitorPath.Path = requestUrl;
                visitorPath.Verb = httpVerb;
                visitorPath.IpProfileId = ipProfile.Id;
                visitorPath.Created = DateTime.UtcNow;
                await VisitorPathRepoistory.AddVisitedPathAsync(visitorPath);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex);

            }
        }
    }
}