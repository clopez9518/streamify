import { useParams } from "react-router";
import { Hero } from "@/streaming-app/components/shared";
import { getMovieById, getSimilarMovies } from "../../hooks/useMovies";
import { Loading, NotFound, Error } from "@/streaming-app/components/shared";
import { MovieDetails } from "@/streaming-app/components/movie/MovieDetails";

export const MoviePage = () => {

    const { id } = useParams();
    const { data: movie, isLoading, error } = getMovieById(id!);
    const { data: similarMovies } = getSimilarMovies(id!);

    if (isLoading) {
        return <Loading />
    }

    if (error) {
        return <Error title="Error fetching movie" />
    }

    if (!movie) {
        return <NotFound title="Movie not found" />
    }


    return (
        <div>
            <Hero movie={movie} />
            <MovieDetails movie={movie} similarContent={similarMovies || []} />
        </div>
    )
}
