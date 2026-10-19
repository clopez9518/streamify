import type { Genre } from "./genre.interface";

export interface Movie {
    id: number;
    title: string;
    description: string;
    durationMinutes: number;
    thumbnailUrl: string;
    backdropUrl: string
    videoUrl: string;
    releaseYear: number;
    rating: number;
    genres: Genre[];
    isTrending: boolean;
    cast: string[];
    crew: string[];
    isInMyList: boolean
}

export interface MovieAdmin {
    id: number;
    title: string;
    description: string;
    durationMinutes: number;
    thumbnailUrl: string;
    backdropUrl: string
    videoUrl: string;
    releaseYear: number;
    rating: number;
    isActive: boolean;
    inactiveAt: Date | null;
    createdAt: Date;
    updatedAt: Date | null;
    genres: Genre[];
    isTrending: boolean;
    cast: string[];
    crew: string[];
}