import { useState } from "react"
import { Play, Plus, Trash, Info } from "lucide-react"
import { Link, useLocation } from "react-router"
import type { MovieDto } from "@/interfaces/dto/movie.dto"
import { useProfileStore } from "@/store/profile.store"
import { useAddToMyList, useRemoveFromMyList } from "@/streaming-app/hooks/useMyList"
import { formatDuration } from "../../../lib/utils"
import { VideoPlayerModal } from "./VideoPlayerModal"

interface Props {
    movie: MovieDto
}

export const Hero = ({ movie }: Props) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const location = useLocation()
    const isMovieDetailPage = location.pathname.startsWith("/movie/")

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
        <>
            <div className="dark relative h-[92vh] min-h-[680px] w-full overflow-hidden bg-[#08090b]">
                <div
                    className="absolute inset-0 scale-105 bg-cover bg-[50%_12%]"
                    style={{ backgroundImage: `url(${movie.backdropUrl})` }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#08090b] via-[#08090b]/35 to-[#08090b]/10" />
                <div className="absolute inset-0 bg-linear-to-r from-[#08090b] via-[#08090b]/70 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-b from-black/45 via-transparent to-transparent" />

                <div className="relative flex h-full items-center px-6 pt-12 lg:px-12">
                    <div className="max-w-3xl space-y-6">
                        <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/70 backdrop-blur-md">
                            Featured
                        </div>

                        <h1 className="max-w-3xl text-5xl font-semibold leading-[0.95] tracking-normal text-white md:text-7xl lg:text-8xl">
                            {movie.title}
                        </h1>

                        <p className="max-w-2xl text-base leading-7 text-white/70 md:text-lg">
                            {movie.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <button
                                onClick={() => setIsPlaying(true)}
                                className="flex cursor-pointer items-center gap-2 rounded-md bg-white px-7 py-3 text-sm font-semibold text-black shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition duration-200 hover:bg-white/90 active:scale-95"
                            >
                                <Play className="h-5 w-5 fill-black" />
                                Play
                            </button>

                            {!isMovieDetailPage && (
                                <Link to={`/movie/${movie.id}`}>
                                    <button className="flex cursor-pointer items-center gap-2 rounded-md border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition duration-200 hover:border-white/40 hover:bg-white/15">
                                        <Info className="h-5 w-5" />
                                        More Info
                                    </button>
                                </Link>
                            )}

                            {activeProfile && (
                                !movie.isInMyList ? (
                                    <button
                                        onClick={handleAddMovie}
                                        aria-label="Add to my list"
                                        className="rounded-md border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition duration-200 hover:border-white/40 hover:bg-white/15"
                                    >
                                        <Plus size={20} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleRemoveMovie}
                                        aria-label="Remove from my list"
                                        className="rounded-md border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition duration-200 hover:border-white/40 hover:bg-white/15"
                                    >
                                        <Trash size={20} />
                                    </button>
                                )
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 text-sm text-white/60">
                            <div className="flex items-center gap-2">
                                <span className="rounded border border-white/20 px-2 py-0.5 text-xs font-semibold text-white/70">
                                    {movie.rating >= 7 ? "16+" : "13+"}
                                </span>
                                <span>{movie.releaseYear}</span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                <span>{formatDuration(movie.durationMinutes)}</span>
                                <span>/</span>
                                {movie.genres.map((genre, index) => (
                                    <span key={index}>
                                        <span>{genre.name}</span>
                                        {index !== movie.genres.length - 1 && <span className="ml-2">/</span>}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <VideoPlayerModal
                isOpen={isPlaying}
                onClose={() => setIsPlaying(false)}
                movie={movie}
            />
        </>
    )
}
