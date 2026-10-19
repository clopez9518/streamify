import { Play, Plus, Trash } from "lucide-react"
import { Link } from "react-router"
import type { MovieDto } from "@/interfaces/dto/movie.dto"
import { formatDuration } from "@/lib/utils"
import { useProfileStore } from "@/store/profile.store"
import { useAddToMyList, useRemoveFromMyList } from "@/streaming-app/hooks/useMyList"

interface Props {
    movie: MovieDto
}

export const MovieItem = ({ movie }: Props) => {

    const { activeProfile } = useProfileStore()
    const { mutate: addToMyList } = useAddToMyList()
    const { mutate: removeFromMyList } = useRemoveFromMyList()

    const handleAddMovie = () => {
        if (!activeProfile) return

        addToMyList({
            profileId: activeProfile.id.toString(),
            movieId: movie.id.toString()
        })
    }

    const handleRemoveMovie = () => {
        if (!activeProfile) return

        removeFromMyList({
            profileId: activeProfile.id.toString(),
            movieId: movie.id.toString()
        })
    }

    return (
        <article className="group relative overflow-hidden rounded-md border border-white/10 bg-white/5 shadow-[0_18px_42px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
            <Link to={`/movie/${movie.id}`} className="block">
                <div className="relative aspect-video overflow-hidden">
                    <img
                        src={movie.thumbnailUrl}
                        alt={movie.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#08090b] via-black/20 to-transparent opacity-70 transition duration-300 group-hover:opacity-90" />
                </div>
            </Link>

            <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="translate-y-8 space-y-3 transition duration-300 group-hover:translate-y-0">
                    <div>
                        <h3 className="truncate text-sm font-medium text-white">
                            {movie.title}
                        </h3>
                        <p className="mt-1 flex items-center gap-2 text-xs text-white/50">
                            <span>{movie.releaseYear}</span>
                            <span>/</span>
                            <span>{formatDuration(movie.durationMinutes)}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 transition duration-300 group-hover:opacity-100">
                        <Link to={`/movie/${movie.id}`}>
                            <button
                                aria-label={`Play ${movie.title}`}
                                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md bg-white text-black transition hover:bg-white/90"
                            >
                                <Play className="h-4 w-4 fill-black" />
                            </button>
                        </Link>

                        {
                            activeProfile && (
                                !movie.isInMyList
                                    ? (
                                        <button
                                            onClick={handleAddMovie}
                                            aria-label="Add to my list"
                                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-white/20 bg-white/10 text-white/80 backdrop-blur-md transition hover:border-white/30 hover:bg-white/15"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    )
                                    : (
                                        <button
                                            onClick={handleRemoveMovie}
                                            aria-label="Remove from my list"
                                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-white/20 bg-white/10 text-white/80 backdrop-blur-md transition hover:border-white/30 hover:bg-white/15"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </button>
                                    )
                            )
                        }
                    </div>

                    <div className="flex flex-wrap gap-x-2 gap-y-1 opacity-0 transition duration-300 group-hover:opacity-100">
                        {movie.genres.slice(0, 2).map((genre, index) => (
                            <span key={index} className="text-xs text-white/60">
                                {genre.name}
                                {index < Math.min(movie.genres.length, 2) - 1 && <span className="ml-2 text-white/40">/</span>}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </article>
    )
}
