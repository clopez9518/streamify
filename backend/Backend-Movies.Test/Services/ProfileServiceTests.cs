
using AutoMapper;
using Moq;
using Movies.Application.DTOs.Movie;
using Movies.Application.DTOs.Profile;
using Movies.Application.DTOs.User;
using Movies.Application.Exceptions;
using Movies.Application.Interfaces;
using Movies.Application.Services;
using DomainProfile = Movies.Domain.Entities.Profile;
using Xunit;

namespace Backend_Movies.Test.Services
{
    public class ProfileServiceTests
    {
        private readonly Mock<IProfileRepository> _profileRepositoryMock;
        private readonly Mock<IMovieService> _movieServiceMock;
        private readonly Mock<IUserService> _userServiceMock;
        private readonly Mock<IMapper> _mapperMock;

        private readonly ProfileService _service;

        public ProfileServiceTests()
        {
            _profileRepositoryMock = new Mock<IProfileRepository>();
            _movieServiceMock = new Mock<IMovieService>();
            _userServiceMock = new Mock<IUserService>();
            _mapperMock = new Mock<IMapper>();

            _service = new ProfileService(
                _userServiceMock.Object,
                _profileRepositoryMock.Object,
                _movieServiceMock.Object,
                _mapperMock.Object
            );
        }

        [Fact]
        public async Task AddToMyList_ShouldThrowNotFound_WhenProfileDoesNotExistOrUserIsNotOwner()
        {
            // Arrange
            _profileRepositoryMock.Setup(x => x.GetByIdAndUserId(1, 100))
                .ReturnsAsync((DomainProfile?)null);

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() =>
                _service.AddToMyList(1, 10, 100)
            );
        }

        [Fact]
        public async Task AddToMyList_ShouldThrowBadRequest_WhenMovieAlreadyInMyList()
        {
            // Arrange
            var profile = new DomainProfile { Id = 1, UserId = 100 };
            var movie = new MovieDto { Id = 10, Title = "Inception" };

            _profileRepositoryMock.Setup(x => x.GetByIdAndUserId(1, 100))
                .ReturnsAsync(profile);
            _movieServiceMock.Setup(x => x.GetById(10, 1))
                .ReturnsAsync(movie);
            _profileRepositoryMock.Setup(x => x.ExistsInMyList(1, 10))
                .ReturnsAsync(true);

            // Act & Assert
            await Assert.ThrowsAsync<BadRequestException>(() =>
                _service.AddToMyList(1, 10, 100)
            );
        }

        [Fact]
        public async Task AddToMyList_ShouldAddMovie_WhenValid()
        {
            // Arrange
            var profile = new DomainProfile { Id = 1, UserId = 100 };
            var movie = new MovieDto { Id = 10, Title = "Inception" };

            _profileRepositoryMock.Setup(x => x.GetByIdAndUserId(1, 100))
                .ReturnsAsync(profile);
            _movieServiceMock.Setup(x => x.GetById(10, 1))
                .ReturnsAsync(movie);
            _profileRepositoryMock.Setup(x => x.ExistsInMyList(1, 10))
                .ReturnsAsync(false);
            _mapperMock.Setup(m => m.Map<MovieDto>(movie))
                .Returns(movie);

            // Act
            var result = await _service.AddToMyList(1, 10, 100);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Inception", result.Title);
            _profileRepositoryMock.Verify(x => x.AddToMyList(profile, 10), Times.Once);
            _profileRepositoryMock.Verify(x => x.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task Add_ShouldThrowBadRequest_WhenUserAlreadyHasMaxProfiles()
        {
            // Arrange
            var user = new UserDto
            {
                Id = 100,
                Profiles = new List<ProfileDto>
                {
                    new() { Id = 1 }, new() { Id = 2 }, new() { Id = 3 }, new() { Id = 4 }, new() { Id = 5 }
                }
            };

            _userServiceMock.Setup(x => x.GetUserById(100))
                .ReturnsAsync(user);

            var createDto = new CreateProfileDto { Name = "Profile 6" };

            // Act & Assert
            await Assert.ThrowsAsync<BadRequestException>(() =>
                _service.Add(createDto, 100)
            );
        }
    }
}
