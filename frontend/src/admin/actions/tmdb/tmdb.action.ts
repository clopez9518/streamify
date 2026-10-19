import type { TmdbMovieDto } from "@/interfaces/dto/tmdb.dto";
import { streamingApi } from "@/api/streaming.api";

export const getTmdbMoviesAction = async (query: string) => {
    try {
        const { data } = await streamingApi.get<TmdbMovieDto[]>("/admin/movies/tmdb", { params: { search: query } });
        return data;
    } catch (error) {
        console.error("Error fetching movies:", error);
        throw error;
    }
}

export const getTmdbMovieByIdAction = async (id: number) => {
    try {
        const { data } = await streamingApi.get<TmdbMovieDto>(`/admin/movies/tmdb/${id}`);
        return data;
    } catch (error) {
        console.error("Error fetching movie:", error);
        throw error;
    }
}