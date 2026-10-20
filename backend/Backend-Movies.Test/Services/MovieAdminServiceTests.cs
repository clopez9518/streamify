using AutoMapper;
using Microsoft.Extensions.Caching.Memory;
using Moq;
using Movies.Application.DTOs.MovieAdmin;
using Movies.Application.Interfaces;
using Movies.Application.Services;
using Movies.Domain.Entities;

namespace Backend_Movies.Test.Services
{
    public class MovieAdminServiceTests
    {
        private readonly Mock<IMovieRepository> _movieRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<ITmdbService> _tmdbServiceMock;
        private readonly IMemoryCache _memoryCache;
        private readonly MovieAdminService _movieAdminService;

        public MovieAdminServiceTests()
        {
            _movieRepositoryMock = new Mock<IMovieRepository>();
            _mapperMock = new Mock<IMapper>();
            _tmdbServiceMock = new Mock<ITmdbService>();
            _memoryCache = new MemoryCache(new MemoryCacheOptions());

            _movieAdminService = new MovieAdminService(
                _movieRepositoryMock.Object,
                _mapperMock.Object,
                _tmdbServiceMock.Object,
                _memoryCache
            );
        }

        [Fact]
        public async Task SetHeroMovie_WhenMovieExists_SetsIsHeroAndReturnsMovieDto()
        {
            // Arrange
            int movieId = 42;
            var updatedMovie = new Movie
            {
                Id = movieId,
                Title = "Inception",
                IsHero = true
            };

            var expectedDto = new MovieAdminDto
            {
                Id = movieId,
                Title = "Inception",
                IsHero = true
            };

            _movieRepositoryMock
                .Setup(r => r.SetHeroMovieAsync(movieId))
                .ReturnsAsync(updatedMovie);

            _mapperMock
                .Setup(m => m.Map<MovieAdminDto>(updatedMovie))
                .Returns(expectedDto);

            // Act
            var result = await _movieAdminService.SetHeroMovie(movieId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(movieId, result.Id);
            Assert.True(result.IsHero);
            _movieRepositoryMock.Verify(r => r.SetHeroMovieAsync(movieId), Times.Once);
        }

        [Fact]
        public async Task SetHeroMovie_WhenMovieDoesNotExist_ReturnsNull()
        {
            // Arrange
            int movieId = 999;
            _movieRepositoryMock
                .Setup(r => r.SetHeroMovieAsync(movieId))
                .ReturnsAsync((Movie?)null);

            // Act
            var result = await _movieAdminService.SetHeroMovie(movieId);

            // Assert
            Assert.Null(result);
            _movieRepositoryMock.Verify(r => r.SetHeroMovieAsync(movieId), Times.Once);
        }
    }
}
