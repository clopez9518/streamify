import { useEffect, useMemo } from "react"
import { X, Film, ExternalLink } from "lucide-react"
import type { MovieDto } from "@/interfaces/dto/movie.dto"

interface VideoPlayerModalProps {
    isOpen: boolean
    onClose: () => void
    movie: MovieDto | null
}

export const VideoPlayerModal = ({ isOpen, onClose, movie }: VideoPlayerModalProps) => {
    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        if (isOpen) {
            document.body.style.overflow = "hidden"
            window.addEventListener("keydown", handleKeyDown)
        }
        return () => {
            document.body.style.overflow = "unset"
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [isOpen, onClose])

    const videoSource = useMemo(() => {
        if (!movie) return { type: "none", src: "" }

        const url = movie.videoUrl?.trim() || ""

        // Check if YouTube URL or ID
        const ytMatch = url.match(
            /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i
        )
        if (ytMatch) {
            return {
                type: "youtube",
                src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`,
            }
        }

        // Direct mp4 / webm
        if (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg")) {
            return { type: "native", src: url }
        }

        // Fallback: If URL is TMDb or generic, use standard high-definition cinematic stream
        return {
            type: "native",
            src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        }
    }, [movie])

    if (!isOpen || !movie) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 transition-all duration-300"
            onClick={onClose}
        >
            <div
                className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0c0d12] shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header bar */}
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 bg-[#08090b]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-white">
                            <Film className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-white truncate max-w-md md:max-w-lg">
                                {movie.title}
                            </h3>
                            <span className="text-xs text-white/50">
                                {movie.releaseYear} • {movie.genres?.map(g => g.name).join(", ")}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                        aria-label="Cerrar reproductor"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Video Container (16:9) */}
                <div className="relative aspect-video w-full bg-black">
                    {videoSource.type === "youtube" ? (
                        <iframe
                            src={videoSource.src}
                            title={`${movie.title} trailer`}
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    ) : (
                        <video
                            src={videoSource.src}
                            controls
                            autoPlay
                            className="h-full w-full object-contain"
                            poster={movie.backdropUrl || movie.thumbnailUrl}
                        >
                            Tu navegador no soporta la reproducción de video HTML5.
                        </video>
                    )}
                </div>

                {/* Footer description */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/5 bg-[#08090b] px-5 py-3 text-xs text-white/60">
                    <p className="line-clamp-1 max-w-2xl">{movie.description}</p>
                    <div className="flex items-center gap-2 shrink-0">
                        <a
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + " official trailer")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                        >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Ver en YouTube
                        </a>
                        <span className="rounded bg-white/10 px-2 py-1 text-[11px] font-medium text-white/80">
                            HD 1080p
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
