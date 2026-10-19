import { useState } from "react"
import { useNavigate } from "react-router"
import { patchMovieAdmin, putMovieGenresAdmin } from "@/admin/hooks/useAdminMovies"
import type { Genre } from "@/interfaces"
import type { UpdateMovieDto } from "@/interfaces/dto/movie.dto"
import type { MovieAdmin } from "@/interfaces/entities/movie.interface"
import { MovieForm, type MovieFormValues } from "./MovieForm"

interface MovieFormProps {
    movie: MovieAdmin
    genres: Genre[]
}

export const EditMovieForm = ({ movie, genres }: MovieFormProps) => {

    const navigate = useNavigate()
    const [isPosting, setIsPosting] = useState(false)
    const patchMovieMutation = patchMovieAdmin()
    const putMovieGenresMutation = putMovieGenresAdmin()

    const onSubmit = async (data: MovieFormValues) => {
        setIsPosting(true)

        try {
            const movieDto: UpdateMovieDto = {
                title: data.title,
                description: data.description,
                durationMinutes: data.durationMinutes,
                videoUrl: data.videoUrl,
                releaseYear: data.releaseYear,
                rating: data.rating,
                isTrending: data.isTrending,
                isActive: data.isActive,
                cast: data.cast,
                crew: data.crew,
            }

            await patchMovieMutation.mutateAsync({
                id: movie.id.toString(),
                movie: movieDto
            })

            await putMovieGenresMutation.mutateAsync({
                id: movie.id.toString(),
                genreIds: data.genres.map(genre => genre.id)
            })

            navigate("/admin/movies")
        } finally {
            setIsPosting(false)
        }
    }

    return (
        <MovieForm
            mode="edit"
            movie={movie}
            genres={genres}
            isPosting={isPosting}
            onSubmit={onSubmit}
            onCancel={() => navigate("/admin/movies")}
        />
    )
}
