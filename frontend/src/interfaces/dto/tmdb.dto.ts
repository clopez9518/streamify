
export interface TmdbMovieDto {
    adult: boolean;
    backdrop_path: string;
    genres: TmdbGenreDto[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    runtime: number;
    credits: {
        cast: TmdbCastDto[];
        crew: TmdbCrewDto[];
    }
}

export interface TmdbGenreDto {
    id: number;
    name: string;
}

export interface TmdbResponseDto {
    page: number;
    results: TmdbMovieDto[];
    total_pages: number;
    total_results: number;
}

export interface TmdbCastDto {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
    cast_id: number;
    character: string;
    credit_id: string;
    order: number;
}

export interface TmdbCrewDto {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
    credit_id: string;
    department: string;
    job: string;
}
