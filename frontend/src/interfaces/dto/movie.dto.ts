import type { Genre } from "../entities/genre.interface";

export interface MovieDto {
    id: number,
    title: string,
    description: string,
    releaseYear: number,
    durationMinutes: number,
    thumbnailUrl: string,
    videoUrl: string,
    rating: number,
    isTrending: boolean
    genres: Genre[]
    backdropUrl: string
    cast: string[];
    crew: string[];
    isInMyList: boolean
}

export interface UpdateMovieDto {
    title?: string,
    description?: string,
    releaseYear?: number,
    durationMinutes?: number,
    videoUrl?: string,
    rating?: number,
    isTrending?: boolean
    isActive?: boolean
    cast?: string[];
    crew?: string[];
    genres?: Genre[]
}

export interface CreateMovieDto {
    title: string,
    description: string,
    releaseYear: number,
    durationMinutes: number,
    thumbnailUrl: string,
    videoUrl: string,
    rating: number,
    isTrending: boolean
    genres: Genre[]
    backdropUrl: string
    cast: string[];
    crew: string[];
}