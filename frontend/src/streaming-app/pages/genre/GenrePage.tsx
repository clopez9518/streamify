import { useMemo } from "react"
import { useParams } from "react-router"
import { useHeroMovie, useMoviesByGenre } from "../../hooks/useMovies"
import { Error, Loading, NotFound } from "../../components/shared"
import { Hero } from "../../components/shared/Hero"
import { MovieGrid } from "../../components/movie/MovieGrid"


export const GenrePage = () => {
    const { genre } = useParams()
    const { data, isLoading, error } = useMoviesByGenre(genre!)
    const { data: heroMovie } = useHeroMovie(genre!);

    const fallbackMovie = useMemo(() => {
        if (!data || data.length === 0) return null;
        return data[0];
    }, [data]);

    if (isLoading) {
        return <Loading />
    }

    if (error) {
        return (
            <Error title="Error fetching movies" />
        )
    }

    if (data?.length === 0 || !data) {
        return (
            <NotFound title="No movies found" />
        )
    }

    return (
        <div>
            <Hero movie={heroMovie || fallbackMovie || data[0]} />
            <MovieGrid movies={data} />
        </div>
    )
}
