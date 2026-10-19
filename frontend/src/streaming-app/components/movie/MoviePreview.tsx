import { ChevronDown, Play, Plus, Trash } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router"
import type { Genre } from "@/interfaces"
import type { MovieDto } from "@/interfaces/dto/movie.dto"
import { formatDuration } from "@/lib/utils"
import { useProfileStore } from "@/store/profile.store"
import { useAddToMyList, useRemoveFromMyList } from "@/streaming-app/hooks/useMyList"

type Props = {
    item: MovieDto
    left: number
    top: number
    align: "left" | "center" | "right"
    cancelClose: () => void
    close: () => void
}

export const MoviePreview = ({ item, left, top, align, cancelClose, close }: Props) => {

    const { activeProfile } = useProfileStore()
    const { mutate: addToMyList } = useAddToMyList()
    const { mutate: removeFromMyList } = useRemoveFromMyList()

    const [isInMyList, setIsInMyList] = useState(item.isInMyList)

    const handleAdd = () => {
        if (!activeProfile) return

        setIsInMyList(true)
        addToMyList({
            profileId: activeProfile.id.toString(),
            movieId: item.id.toString()
        }, {
            onError: () => setIsInMyList(false)
        })
    }

    const handleRemove = () => {
        if (!activeProfile) return

        setIsInMyList(false)
        removeFromMyList({
            profileId: activeProfile.id.toString(),
            movieId: item.id.toString()
        }, {
            onError: () => setIsInMyList(true)
        })
    }

    let alignClass = "origin-center -translate-x-1/2"
    if (align === "left") alignClass = "origin-left translate-x-0"
    if (align === "right") alignClass = "origin-right -translate-x-full"

    return (
        <div
            className={`absolute z-80 w-[min(420px,calc(100vw-32px))] -translate-y-1/2 overflow-hidden rounded-md border border-white/10 bg-[#101216]/95 shadow-[0_28px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 ${alignClass}`}
            style={{ left, top }}
            onMouseEnter={cancelClose}
            onMouseLeave={close}
        >
            <div className="relative aspect-video">
                <Link to={`/movie/${item.id}`}>
                    <img
                        src={item.backdropUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                    />
                </Link>
                <div className="absolute inset-0 bg-linear-to-t from-[#101216] via-transparent to-transparent" />
            </div>

            <div className="space-y-4 p-4 text-white">
                <div className="flex items-center gap-3">
                    <Link to={`/movie/${item.id}`}>
                        <button
                            aria-label={`Play ${item.title}`}
                            className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-black transition hover:bg-white/90"
                        >
                            <Play size={20} fill="black" />
                        </button>
                    </Link>

                    {
                        activeProfile && (!isInMyList
                            ? (
                                <button
                                    onClick={handleAdd}
                                    aria-label="Add to my list"
                                    className="flex h-10 w-10 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white/80 transition hover:border-white/30 hover:bg-white/15"
                                >
                                    <Plus size={18} />
                                </button>
                            )
                            : (
                                <button
                                    onClick={handleRemove}
                                    aria-label="Remove from my list"
                                    className="flex h-10 w-10 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white/80 transition hover:border-white/30 hover:bg-white/15"
                                >
                                    <Trash size={18} />
                                </button>
                            ))
                    }

                    <div className="ml-auto">
                        <button
                            aria-label="More details"
                            className="flex h-10 w-10 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white/80 transition hover:border-white/30 hover:bg-white/15"
                        >
                            <ChevronDown size={18} />
                        </button>
                    </div>
                </div>

                <h3 className="text-lg font-medium tracking-normal">{item.title}</h3>

                <div className="flex flex-wrap items-center gap-2 text-sm text-white/60">
                    <span className="rounded border border-white/20 px-1.5 py-0.5 text-xs text-white/70">
                        16+
                    </span>
                    <span>{formatDuration(item.durationMinutes)}</span>
                    <span className="rounded border border-white/20 px-1.5 py-0.5 text-xs text-white/70">
                        HD
                    </span>
                    <span>{item.releaseYear}</span>
                </div>

                <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-white/80">
                    {item.genres.map((genre: Genre, index: number) => (
                        <span key={index}>
                            <span>{genre.name}</span>
                            {index !== item.genres.length - 1 && <span className="ml-2 text-white/40">/</span>}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}
