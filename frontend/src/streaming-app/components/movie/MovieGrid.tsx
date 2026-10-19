import type { MovieDto } from "@/interfaces/dto/movie.dto";
import { MovieItem } from "./MovieItem";

interface MovieGridProps {
    movies: MovieDto[];
    eyebrow?: string;
    title?: string;
}

export const MovieGrid = ({ movies, eyebrow = "Catalog", title = "Browse all titles" }: MovieGridProps) => {
    return (
        <div className="px-6 md:px-12 py-2">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-white/50">
                        {eyebrow}
                    </p>
                    <h2 className="text-2xl font-semibold tracking-normal text-white md:text-3xl">
                        {title}
                    </h2>
                </div>

                <p className="text-sm text-white/50">
                    {movies.length} {movies.length === 1 ? "title" : "titles"}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {movies.map((movie) => (
                    <MovieItem key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    )
}
