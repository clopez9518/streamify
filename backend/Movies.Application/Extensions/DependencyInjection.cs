

using Microsoft.Extensions.DependencyInjection;
using FluentValidation;
using Movies.Application.Validators.Profile;
using Movies.Application.DTOs.Profile;
using Movies.Application.Interfaces;
using Movies.Application.Services;
using Movies.Application.Mappings;

namespace Movies.Application.Extensions
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            // Application Services
            services.AddScoped<IMovieService, MovieService>();
            services.AddScoped<IMovieAdminService, MovieAdminService>();
            services.AddScoped<IGenreService, GenreService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IProfileService, ProfileService>();
            services.AddScoped<IRefreshTokenService, RefreshTokenService>();

            // In-Memory Cache
            services.AddMemoryCache();

            // AutoMapper
            services.AddAutoMapper(cfg => { }, typeof(MovieProfile).Assembly);

            // FluentValidation
            services.AddValidatorsFromAssemblyContaining<CreateProfileDtoValidator>();
            return services;
        }
    }
}
