

using Movies.Infrastructure.Extensions;
using Movies.Infrastructure.Persistence;
using Movies.Infrastructure.Persistence.Seed;
using Microsoft.EntityFrameworkCore;
using Movies.Infrastructure.Middleware;
using Movies.Application.Extensions;
using Movies.Api.Filters;
using Movies.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Config cors: supports local dev, configured production URLs, and Vercel domains (*.vercel.app)
var configuredOrigins = builder.Configuration["CorsSettings:FrontendUrl"]?
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    ?? [];

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(origin =>
        {
            if (string.IsNullOrWhiteSpace(origin)) return false;

            // Allow localhost for local development
            if (origin.StartsWith("http://localhost:") || origin.StartsWith("https://localhost:"))
                return true;

            // Allow explicitly configured origins
            if (configuredOrigins.Contains(origin, StringComparer.OrdinalIgnoreCase))
                return true;

            // Allow Vercel deployments (*.vercel.app)
            if (Uri.TryCreate(origin, UriKind.Absolute, out var uri) &&
                uri.Host.EndsWith("vercel.app", StringComparison.OrdinalIgnoreCase))
                return true;

            return false;
        })
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// Add services to the container.
builder.Services
    .AddControllers(options =>
    {
        options.Filters.Add<ValidationFilter>();
    });

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

//Presentation Dependency Injection
builder.Services.AddPresentation();
//Application Dependency Injection
builder.Services.AddApplication();
//Infrastructure Dependency Injection 
builder.Services.AddInfrastructure(builder.Configuration);


var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    try
    {
        var context = services.GetRequiredService<AppDBContext>();
        var seeder = services.GetRequiredService<DbInitializer>();

        await context.Database.MigrateAsync();
        await seeder.SeedAsync();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error during migration/seed: {ex.Message}");
        throw;
    }
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseMiddleware<ExceptionMiddleware>();

app.UseCors("AllowFrontend");

if (!app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();

// Lightweight health check endpoint for AWS ECS / ALB Target Group (does not keep DB awake)
app.MapGet("/health", () => Results.Ok(new
{
    status = "Healthy",
    service = "Streamify.Api",
    environment = app.Environment.EnvironmentName,
    timestamp = DateTime.UtcNow
}));

// Optional database connectivity check for manual diagnostics
app.MapGet("/health/db", async (AppDBContext dbContext) =>
{
    var canConnect = await dbContext.Database.CanConnectAsync();
    return canConnect
        ? Results.Ok(new { status = "Healthy", database = "Connected", timestamp = DateTime.UtcNow })
        : Results.Problem("Database unavailable", statusCode: 503);
});

app.MapControllers();

app.Run();
