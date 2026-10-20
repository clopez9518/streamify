import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getAdminMovieByIdAction,
    getAdminMoviesAction,
    patchAdminMovieAction,
    postAdminMovieAction,
    putAdminMovieGenresAction,
    putAdminSetHeroMovieAction
} from "../actions/movie/adminMovie.action";
import type { CreateMovieDto, UpdateMovieDto } from "@/interfaces/dto/movie.dto";
import { getTmdbMovieByIdAction, getTmdbMoviesAction } from "../actions/tmdb/tmdb.action";
import { notify } from "@/lib/notify";


export const useMoviesAdmin = () => {
    return useQuery({
        queryKey: ["admin-movies"],
        queryFn: getAdminMoviesAction,
        retry: 1
    });
}

export const useMovieByIdAdmin = (id: string) => {
    return useQuery({
        queryKey: ["admin-movie", id],
        queryFn: () => getAdminMovieByIdAction(id),
        retry: 1
    });
}

export const usePatchMovieAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, movie }: { id: string; movie: UpdateMovieDto }) =>
            patchAdminMovieAction(id, movie),

        retry: 1,

        onSuccess: (updatedMovie) => {
            notify.success("Movie updated successfully");
            queryClient.invalidateQueries({ queryKey: ["admin-movies"] });
            queryClient.invalidateQueries({ queryKey: ["movies"] });
            queryClient.invalidateQueries({ queryKey: ["hero-movie"] });
            queryClient.invalidateQueries({ queryKey: ["home"] });
            queryClient.setQueryData(["admin-movie", updatedMovie.id.toString()], updatedMovie);
        },
        onError: () => {
            notify.error('Error updating movie');
        }
    });
};

export const useSetHeroMovieAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => putAdminSetHeroMovieAction(id),
        retry: 1,

        onSuccess: (updatedMovie) => {
            notify.success(`"${updatedMovie.title}" fijada como Hero en Home`);
            queryClient.invalidateQueries({ queryKey: ["admin-movies"] });
            queryClient.invalidateQueries({ queryKey: ["movies"] });
            queryClient.invalidateQueries({ queryKey: ["hero-movie"] });
            queryClient.invalidateQueries({ queryKey: ["home"] });
            queryClient.setQueryData(["admin-movie", updatedMovie.id.toString()], updatedMovie);
        },
        onError: () => {
            notify.error('Error al fijar la película como Hero');
        }
    });
};

export const usePutMovieGenresAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, genreIds }: { id: string; genreIds: number[] }) =>
            putAdminMovieGenresAction(id, genreIds),
        retry: 1,

        onSuccess: (updatedMovie) => {
            queryClient.invalidateQueries({ queryKey: ["admin-movies"] });
            queryClient.invalidateQueries({ queryKey: ["movies"] });
            queryClient.setQueryData(["admin-movie", updatedMovie.id.toString()], updatedMovie);
        },
    });
};

export const usePostMovieAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (movie: CreateMovieDto) =>
            postAdminMovieAction(movie),
        retry: 1,

        onSuccess: (createdMovie) => {
            notify.success("Movie created successfully");
            queryClient.invalidateQueries({ queryKey: ["admin-movies"] });
            queryClient.invalidateQueries({ queryKey: ["movies"] });
            queryClient.invalidateQueries({ queryKey: ["hero-movie"] });
            queryClient.invalidateQueries({ queryKey: ["home"] });
            queryClient.setQueryData(["admin-movie", createdMovie.id.toString()], createdMovie);
        },
        onError: () => {
            notify.error('Error creating movie');
        }
    });
};

export const useTmdbMovies = (query: string) => {
    return useQuery({
        queryKey: ["tmdb-movies", query],
        queryFn: () => getTmdbMoviesAction(query),
        enabled: !!query.trim() && query.length > 2,
        retry: 1
    });
}

export const useTmdbMovieById = (id: number) => {
    return useQuery({
        queryKey: ["tmdb-movie", id],
        queryFn: () => getTmdbMovieByIdAction(id),
        enabled: !!id,
        retry: 1
    });
}

export const getMoviesAdmin = useMoviesAdmin;
export const getMovieByIdAdmin = useMovieByIdAdmin;
export const patchMovieAdmin = usePatchMovieAdmin;
export const setHeroMovieAdmin = useSetHeroMovieAdmin;
export const putMovieGenresAdmin = usePutMovieGenresAdmin;
export const postMovieAdmin = usePostMovieAdmin;
export const getTmdbMovies = useTmdbMovies;
export const getTmdbMovieById = useTmdbMovieById;
