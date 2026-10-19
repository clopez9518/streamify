import { patchMovieAdmin } from "@/admin/hooks/useAdminMovies"
import type { MovieAdmin } from "@/interfaces"

export const MovieActionsCell = ({ movie }: { movie: MovieAdmin }) => {
    const movieMutation = patchMovieAdmin()

    return (
        <div className="flex gap-2">
            <button
                type="button"
                className={`inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${movie.isActive
                    ? "border-red-300/20 bg-red-400/10 text-red-100 hover:border-red-200/40 hover:bg-red-400/15"
                    : "border-emerald-300/20 bg-emerald-400/10 text-emerald-100 hover:border-emerald-200/40 hover:bg-emerald-400/15"
                    }`}
                onClick={() => movieMutation.mutate({ id: movie.id.toString(), movie: { isActive: !movie.isActive } })}
                disabled={movieMutation.isPending}
            >
                {movie.isActive
                    ? "Deactivate"
                    : "Activate"}
            </button>
        </div>
    )
}
