using AutoMapper;
using Microsoft.Extensions.Caching.Memory;
using Movies.Application.DTOs.Movie;
using Movies.Application.Exceptions;
using Movies.Application.Interfaces;
using Movies.Domain.Entities;

namespace Movies.Application.Services
{
    public class MovieService : IMovieService
    {
        private readonly IMovieRepository _movieRepository;
        private readonly IProfileRepository _profileRepository;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _cache;

        public MovieService(
            IMovieRepository movieRepository,
            IProfileRepository profileRepository,
            IMapper mapper,
            IMemoryCache cache)
        {
            _movieRepository = movieRepository;
            _profileRepository = profileRepository;
            _mapper = mapper;
            _cache = cache;
        }

        private async Task<bool> IsKidsProfile(int? profileId)
        {
            if (!profileId.HasValue) return false;
            var profile = await _profileRepository.GetById(profileId.Value);
            return profile?.IsKids ?? false;
        }

        public async Task<(IEnumerable<MovieDto> Movies, int TotalRecords, int PageSize)> GetAll(int page = 1, int pageSize = 10, int? profileId = null)
        {
            const int maxPageSize = 50;
            const int defaultPageSize = 10;

            pageSize = pageSize <= 0 ? defaultPageSize : pageSize;
            pageSize = pageSize > maxPageSize ? maxPageSize : pageSize;

            var isKids = await IsKidsProfile(profileId);
            var movies = await _movieRepository.GetAllAsync(page, pageSize, isKids);
            var movieDtos = movies.Select(movie => _mapper.Map<MovieDto>(movie)).ToList();

            var totalRecords = await _movieRepository.TotalMoviesCountAsync(isKids);

            if (profileId.HasValue)
            {
                await SetIsInMyList(profileId.Value, movieDtos);
            }
            return (movieDtos, totalRecords, pageSize);
        }

        public async Task<IEnumerable<MovieDto>> GetByGenre(int genreId, int? profileId)
        {
            var isKids = await IsKidsProfile(profileId);
            var movies = await _movieRepository.GetMoviesByGenre(genreId, isKids);
            var movieDtos = movies.Select(movie => _mapper.Map<MovieDto>(movie)).ToList();
            if (profileId.HasValue)
            {
                await SetIsInMyList(profileId.Value, movieDtos);
            }
            return movieDtos;
        }

        public async Task<MovieDto> GetById(int id, int? profileId)
        {
            var movie = await _movieRepository.GetByIdAsync(id) ??
                throw new NotFoundException("Movie not found", "MOVIE_NOT_FOUND");

            var movieDto = _mapper.Map<MovieDto>(movie);
            if (profileId.HasValue)
            {
                await SetIsInMyList(profileId.Value, new List<MovieDto> { movieDto });
            }
            return movieDto;
        }

        public async Task<MovieDto> GetHeroMovie(int? genreId, int? profileId)
        {
            var isKids = await IsKidsProfile(profileId);
            string cacheKey = $"hero_movie_{genreId ?? 0}_{isKids}";

            if (!_cache.TryGetValue(cacheKey, out MovieDto? cachedMovie) || cachedMovie == null)
            {
                var movie = await _movieRepository.GetHeroMovieAsync(genreId, isKids);
                if (movie == null)
                {
                    // Fallback to any available movie
                    var fallbackMovies = await _movieRepository.GetAllAsync(1, 1, isKids);
                    movie = fallbackMovies.FirstOrDefault() ??
                        throw new NotFoundException("No movies found", "MOVIE_NOT_FOUND");
                }

                cachedMovie = _mapper.Map<MovieDto>(movie);

                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromMinutes(15));

                _cache.Set(cacheKey, cachedMovie, cacheEntryOptions);
            }

            // Create profile-specific instance with updated IsInMyList flag
            var result = new MovieDto
            {
                Id = cachedMovie.Id,
                Title = cachedMovie.Title,
                Description = cachedMovie.Description,
                DurationMinutes = cachedMovie.DurationMinutes,
                ThumbnailUrl = cachedMovie.ThumbnailUrl,
                BackdropUrl = cachedMovie.BackdropUrl,
                VideoUrl = cachedMovie.VideoUrl,
                ReleaseYear = cachedMovie.ReleaseYear,
                Rating = cachedMovie.Rating,
                IsTrending = cachedMovie.IsTrending,
                Genres = cachedMovie.Genres,
                Cast = cachedMovie.Cast,
                Crew = cachedMovie.Crew,
            };

            if (profileId.HasValue)
            {
                await SetIsInMyList(profileId.Value, new List<MovieDto> { result });
            }
            return result;
        }

        public async Task<IEnumerable<MovieDto>> GetSimilarMovies(int movieId, int? profileId)
        {
            var movies = await _movieRepository.GetSimilarMovies(movieId);
            var movieDtos = movies.Select(movie => _mapper.Map<MovieDto>(movie)).ToList();
            if (profileId.HasValue)
            {
                await SetIsInMyList(profileId.Value, movieDtos);
            }
            return movieDtos;
        }

        public async Task<IEnumerable<MovieDto>> GetTrendingMovies(int? profileId)
        {
            var isKids = await IsKidsProfile(profileId);
            var movies = await _movieRepository.GetTrendingMovies(isKids);
            var movieDtos = movies.Select(movie => _mapper.Map<MovieDto>(movie)).ToList();
            if (profileId.HasValue)
            {
                await SetIsInMyList(profileId.Value, movieDtos);
            }
            return movieDtos;
        }

        public async Task<IEnumerable<MovieDto>> GetSortMovies(string sortBy = "recent", int limit = 15, int? profileId = null)
        {
            var isKids = await IsKidsProfile(profileId);
            var movies = await _movieRepository.GetMoviesSortAsync(sortBy, limit, isKids);
            var movieDtos = movies.Select(movie => _mapper.Map<MovieDto>(movie)).ToList();
            if (profileId.HasValue)
            {
                await SetIsInMyList(profileId.Value, movieDtos);
            }
            return movieDtos;
        }

        public async Task<IEnumerable<MovieDto>> Search(string query, int? profileId = null)
        {
            var isKids = await IsKidsProfile(profileId);
            var movies = await _movieRepository.SearchAsync(query, 20, isKids);
            var movieDtos = movies.Select(movie => _mapper.Map<MovieDto>(movie)).ToList();
            if (profileId.HasValue)
            {
                await SetIsInMyList(profileId.Value, movieDtos);
            }
            return movieDtos;
        }

        private async Task<IEnumerable<MovieDto>> SetIsInMyList(int profileId, List<MovieDto> movies)
        {
            var myListMovieIds = await _profileRepository.GetMyListMoviesIds(profileId);
            foreach (var movie in movies)
            {
                movie.IsInMyList = myListMovieIds.Contains(movie.Id);
            }
            return movies;
        }
    }
}
