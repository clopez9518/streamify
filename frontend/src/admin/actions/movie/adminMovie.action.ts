import { streamingApi } from "@/api/streaming.api";
import type { MovieAdmin } from "@/interfaces";
import type { CreateMovieDto, UpdateMovieDto } from "@/interfaces/dto/movie.dto";


export const getAdminMoviesAction = async () => {
    try {
        const { data } = await streamingApi.get<MovieAdmin[]>("/admin/movies");
        return data;
    } catch (error) {
        console.error("Error fetching movies:", error);
        throw error;
    }
}

export const getAdminMovieByIdAction = async (id: string) => {
    try {
        const { data } = await streamingApi.get<MovieAdmin>(`/admin/movies/${id}`);
        return data;
    } catch (error) {
        console.error("Error fetching movie:", error);
        throw error;
    }
}

export const patchAdminMovieAction = async (id: string, movie: UpdateMovieDto) => {
    try {
        const { data } = await streamingApi.patch<MovieAdmin>(`/admin/movies/${id}`, movie);
        return data;
    } catch (error) {
        console.error("Error updating movie:", error);
        throw error;
    }
}

export const putAdminMovieGenresAction = async (id: string, genreIds: number[]) => {
    try {
        const { data } = await streamingApi.put<MovieAdmin>(`/admin/movies/genres/${id}`, { genreIds });
        return data;
    } catch (error) {
        console.error("Error updating movie genres:", error);
        throw error;
    }
}

export const postAdminMovieAction = async (movie: CreateMovieDto) => {
    try {
        const { data } = await streamingApi.post<MovieAdmin>(`/admin/movies`, movie);
        return data;
    } catch (error) {
        console.error("Error creating movie:", error);
        throw error;
    }
}