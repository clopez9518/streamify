using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Movies.Application.Interfaces;
using Movies.Domain.Entities;
using Movies.Infrastructure.External.TMDb.Mappers;
using Movies.Infrastructure.External.TMDb.Services;

namespace Movies.Infrastructure.Persistence.Seed
{
    public class DbInitializer
    {
        private readonly ITmdbService _tmdbService;
        private readonly AppDBContext _context;
        private readonly IPasswordHasher _passwordHasher;
        private readonly ILogger<DbInitializer> _logger;

        public DbInitializer(
            ITmdbService tmdbService, 
            AppDBContext context, 
            IPasswordHasher passwordHasher,
            ILogger<DbInitializer> logger)
        {
            _tmdbService = tmdbService;
            _context = context;
            _passwordHasher = passwordHasher;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            //_context.Users.RemoveRange(_context.Users);
            //_context.SaveChanges();

            //_context.Database.ExecuteSqlRaw(@"
            //    TRUNCATE TABLE ""MovieGenres"", ""Movies"", ""Genres""
            //    RESTART IDENTITY CASCADE;
            //");

            var adminUser = await _context.Users
                .Include(u => u.Profiles)
                .FirstOrDefaultAsync(u => u.Email == "admin@movies.com");

            if (adminUser == null)
            {
                adminUser = new User
                {
                    Email = "admin@movies.com",
                    PasswordHash = _passwordHasher.HashPassword("Admin1234!"),
                    CreatedAt = DateTime.UtcNow,
                    Role = "admin"
                };

                _context.Users.Add(adminUser);
                await _context.SaveChangesAsync();

                var profile = new Profile
                {
                    Name = "Admin",
                    UserId = adminUser.Id,
                    IsKids = false,
                    AvatarUrl = "https://picsum.photos/200/200?random=1"
                };

                _context.Profiles.Add(profile);
                await _context.SaveChangesAsync();
            }
            else if (string.IsNullOrWhiteSpace(adminUser.PasswordHash) || !adminUser.PasswordHash.StartsWith("$2"))
            {
                // Auto-healing: repair legacy literal unhashed string in existing database
                adminUser.PasswordHash = _passwordHasher.HashPassword("Admin1234!");
                if (!adminUser.Profiles.Any())
                {
                    adminUser.Profiles.Add(new Profile
                    {
                        Name = "Admin",
                        UserId = adminUser.Id,
                        IsKids = false,
                        AvatarUrl = "https://picsum.photos/200/200?random=1"
                    });
                }
                await _context.SaveChangesAsync();
                _logger.LogInformation("Admin password hash repaired successfully with BCrypt.");
            }

            try
            {
                if (!_context.Genres.Any())
                {
                    var tmdbGenres = await _tmdbService.GetGenres();

                    var genres = tmdbGenres.Select(g => new Genre
                    {
                        IdTmdb = g.Id,
                        Name = g.Name
                    }).ToList();

                    _context.Genres.AddRange(genres);
                    await _context.SaveChangesAsync();
                }

                if (!_context.Movies.Any())
                {
                    var genres = await _context.Genres.ToListAsync();

                    var now = DateTime.UtcNow;

                    var movies = new List<Movie>();
                    var moviesFromTmdb = await _tmdbService.GetPopularMoviesAsync(2);

                    foreach (var tmdbMovie in moviesFromTmdb)
                    {
                        var movie = await _tmdbService.GetMovieDetailsAsync(tmdbMovie.Id);

                        if (movie == null) continue;

                        var movieMap = TmdbMovieMapper.ToMovie(movie, genres);
                        movies.Add(movieMap);
                    }

                    _context.Movies.AddRange(movies);
                    await _context.SaveChangesAsync();     
                }
                else
                {
                    // Auto-healing: update existing movies that still point to themoviedb.org
                    var moviesNeedingTrailers = await _context.Movies
                        .Where(m => string.IsNullOrEmpty(m.VideoUrl) || m.VideoUrl.Contains("themoviedb.org"))
                        .Take(20)
                        .ToListAsync();

                    if (moviesNeedingTrailers.Any())
                    {
                        _logger.LogInformation("Updating trailers for {Count} existing movies from TMDb...", moviesNeedingTrailers.Count);
                        foreach (var m in moviesNeedingTrailers)
                        {
                            var match = System.Text.RegularExpressions.Regex.Match(m.VideoUrl ?? "", @"movie/(\d+)");
                            if (match.Success && int.TryParse(match.Groups[1].Value, out var tmdbId))
                            {
                                var details = await _tmdbService.GetMovieDetailsAsync(tmdbId);
                                var trailerKey = details?.Videos?.Results?
                                    .FirstOrDefault(v => v.Site == "YouTube" && v.Type == "Trailer")?.Key
                                    ?? details?.Videos?.Results?.FirstOrDefault(v => v.Site == "YouTube")?.Key;

                                if (!string.IsNullOrEmpty(trailerKey))
                                {
                                    m.VideoUrl = $"https://www.youtube.com/watch?v={trailerKey}";
                                }
                            }
                        }
                        await _context.SaveChangesAsync();
                        _logger.LogInformation("Existing movie trailers updated successfully.");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Could not seed initial movies/genres from TMDb. Seed will continue without external catalog.");
            }
        }
    }
}
