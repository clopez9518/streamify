import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { getTmdbMovieByIdAction } from "@/admin/actions/tmdb/tmdb.action"
import { postMovieAdmin, putMovieGenresAdmin } from "@/admin/hooks/useAdminMovies"
import type { Genre } from "@/interfaces"
import type { CreateMovieDto } from "@/interfaces/dto/movie.dto"
import type { TmdbMovieDto } from "@/interfaces/dto/tmdb.dto"
import { useState } from "react"
import { MovieForm, type MovieFormValues } from "./MovieForm"

interface MovieFormProps {
    movie?: CreateMovieDto
    genres: Genre[]
}

export const CreateMovieForm = ({ movie, genres }: MovieFormProps) => {

    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const postMovieMutation = postMovieAdmin()
    const putMovieGenresMutation = putMovieGenresAdmin()
    const [isPosting, setIsPosting] = useState(false)

    const onSubmit = async (data: MovieFormValues) => {
        setIsPosting(true)

        try {
            const movieDto: CreateMovieDto = {
                title: data.title,
                description: data.description,
                durationMinutes: data.durationMinutes,
                thumbnailUrl: data.thumbnailUrl,
                backdropUrl: data.backdropUrl,
                videoUrl: data.videoUrl,
                releaseYear: data.releaseYear,
                rating: data.rating,
                genres: data.genres,
                isTrending: data.isTrending,
                cast: data.cast,
                crew: data.crew
            }

            const createdMovie = await postMovieMutation.mutateAsync(movieDto)

            if (createdMovie) {
                const genreIds = data.genres.map(genre => genre.id)
                await putMovieGenresMutation.mutateAsync({ id: createdMovie.id.toString(), genreIds })
                navigate("/admin/dashboard")
            }
        } finally {
            setIsPosting(false)
        }
    }

    const onSelectMovie = async (selectedMovie: TmdbMovieDto): Promise<Partial<MovieFormValues> | void> => {
        const movieDetails = await queryClient.fetchQuery({
            queryKey: ["tmdb-movie", selectedMovie.id],
            queryFn: () => getTmdbMovieByIdAction(selectedMovie.id),
            retry: 1
        })

        if (!movieDetails) return

        return {
            title: movieDetails.title,
            description: movieDetails.overview,
            durationMinutes: movieDetails.runtime,
            thumbnailUrl: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`,
            backdropUrl: `https://image.tmdb.org/t/p/w1280${movieDetails.backdrop_path}`,
            releaseYear: new Date(movieDetails.release_date).getFullYear(),
            rating: movieDetails.vote_average,
            genres: genres.filter(genre => movieDetails.genres.some(tmdbGenre => tmdbGenre.id === genre.idTmdb)),
            isTrending: movieDetails.popularity >= 80,
            cast: movieDetails.credits.cast.map(castMember => castMember.name),
            crew: movieDetails.credits.crew.map(crewMember => crewMember.name),
        }
    }

    return (
        <MovieForm
            mode="create"
            movie={movie}
            genres={genres}
            isPosting={isPosting}
            onSubmit={onSubmit}
            onCancel={() => navigate("/admin/movies")}
            onSelectMovie={onSelectMovie}
        />
    )
}
