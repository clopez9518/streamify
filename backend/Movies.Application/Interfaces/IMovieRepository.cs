using Movies.Domain.Entities;

namespace Movies.Application.Interfaces
{
    public interface IMovieRepository
    {
        Task AddAsync(Movie entity);
        Task<IEnumerable<Movie>> GetAllAsync(int page = 1, int pageSize = 10, bool isKids = false);
        Task<Movie?> GetByIdAsync(int id);
        Task LoadGenre(Movie movie);
        Task<IEnumerable<Movie>> GetAllAsyncAdmin();
        Task<IEnumerable<Movie>> GetMoviesByGenre(int id, bool isKids = false);
        Task<IEnumerable<Movie>> GetTrendingMovies(bool isKids = false);
        Task<IEnumerable<Movie>> GetSimilarMovies(int movieId);
        Task<IEnumerable<Movie>> GetMoviesSortAsync(string sortBy = "recent", int limit = 15, bool isKids = false);
        Task<IEnumerable<Movie>> SearchAsync(string query, int limit = 20, bool isKids = false);
        Task<Movie?> GetHeroMovieAsync(int? genreId = null, bool isKids = false);
        Task<Movie?> SetHeroMovieAsync(int movieId);
        void UpdateMovieGenres(Movie movie, List<int> genreIds);
        Task<int> TotalMoviesCountAsync(bool isKids = false);

        Task SaveChangesAsync();
    }
}
