import {
    getHeroMovie,
    getSortMovies,
    getTrendingMovies
} from "./useMovies";
import { useGetMyList } from "./useMyList";

export const useHome = (profileId: string) => {

    const { data: trendingMovies, isLoading: trendingLoading, error: trendingError } =
        getTrendingMovies();

    const { data: topRatedMovies, isLoading: topRatedLoading, error: topRatedError } =
        getSortMovies('top-rated', 15);

    const { data: newReleasesMovies, isLoading: newReleasesLoading, error: newReleasesError } =
        getSortMovies('release', 15);

    const { data: myListMovies, isLoading: myListLoading, error: myListError } =
        useGetMyList(profileId);

    const { data: heroMovie, isLoading: heroLoading, error: heroError } =
        getHeroMovie();

    const { data: recentlyAddedMovies, isLoading: recentlyAddedLoading, error: recentlyAddedError } =
        getSortMovies('recent', 15);

    return {
        heroMovie,
        trendingMovies,
        topRatedMovies,
        newReleasesMovies,
        myListMovies,
        recentlyAddedMovies,
        isLoading:
            trendingLoading ||
            topRatedLoading ||
            newReleasesLoading ||
            myListLoading ||
            heroLoading ||
            recentlyAddedLoading,
        error:
            trendingError ||
            topRatedError ||
            newReleasesError ||
            myListError ||
            heroError ||
            recentlyAddedError
    }
}