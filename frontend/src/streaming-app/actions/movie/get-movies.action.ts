import { streamingApi } from "@/api/streaming.api";
import type { MovieDto } from "@/interfaces/dto/movie.dto";
import { getGenresAction } from "../genre/genre.action";
import type { PaginatedResponseDto } from "@/interfaces/dto/paginated-response.dto";


export const getMoviesAction = async (page: number = 1, pageSize: number = 20) => {
    const { data } = await streamingApi.get<PaginatedResponseDto<MovieDto>>(`/movies?page=${page}&pageSize=${pageSize}`);
    return data;
}

export const getMovieByIdAction = async (id: string) => {
    const { data } = await streamingApi.get<MovieDto>(`/movies/${id}`);
    return data;
}

export const getMoviesByGenreAction = async (genre: string) => {
    const genres = await getGenresAction();
    const genreId = genres.find((g) => g.name.toLowerCase() === genre.toLowerCase())?.id || 0;

    const { data } = await streamingApi.get<MovieDto[]>(`/movies/bygenre/${genreId}`);
    return data;
}

export const getTrendingMoviesAction = async () => {
    const { data } = await streamingApi.get<MovieDto[]>("/movies/trending");
    return data;
}

export const getSortMoviesAction = async (sortBy: string = 'recent', limit: number = 15) => {
    const { data } = await streamingApi.get<MovieDto[]>(`/movies/sort?sortBy=${sortBy}&limit=${limit}`);
    return data;
}

export const getSimilarMoviesAction = async (id: string) => {
    const { data } = await streamingApi.get<MovieDto[]>(`/movies/similar/${id}`);
    return data;
}

export const getHeroMovieAction = async (genre?: string) => {
    const genres = await getGenresAction();
    const genreId = genre ? genres.find((g) => g.name.toLowerCase() === genre.toLowerCase())?.id || undefined : undefined;

    const url = genreId ? `/movies/hero?genreId=${genreId}` : `/movies/hero`;
    const { data } = await streamingApi.get<MovieDto>(url);
    return data;
}

export const searchMoviesAction = async (query: string): Promise<MovieDto[]> => {
    if (!query || !query.trim()) return [];
    const { data } = await streamingApi.get<MovieDto[]>(`/movies/search?query=${encodeURIComponent(query.trim())}`);
    return data;
}