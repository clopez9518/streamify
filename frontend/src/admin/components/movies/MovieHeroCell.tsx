import { setHeroMovieAdmin } from "@/admin/hooks/useAdminMovies"
import type { MovieAdmin } from "@/interfaces"
import { Star } from "lucide-react"

export const MovieHeroCell = ({ movie }: { movie: MovieAdmin }) => {
    const setHeroMutation = setHeroMovieAdmin()

    if (movie.isHero) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/15 px-2.5 py-1 text-xs font-semibold text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.2)]">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                Hero
            </span>
        )
    }

    return (
        <button
            type="button"
            onClick={() => setHeroMutation.mutate(movie.id)}
            disabled={setHeroMutation.isPending}
            title={`Fijar "${movie.title}" como Hero en Home`}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/60 hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-300 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
            <Star className="h-3.5 w-3.5 text-white/40" />
            <span>Fijar Hero</span>
        </button>
    )
}
