import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Link } from "react-router"
import type { MovieDto } from "@/interfaces/dto/movie.dto"
import { MoviePreview } from "../movie/MoviePreview"

type Props = {
    title: string
    items: MovieDto[]
}

export const ContentRow = ({ title, items }: Props) => {

    const containerRef = useRef<HTMLDivElement>(null)
    const rowRef = useRef<HTMLDivElement>(null)

    const openTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
    const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

    const [preview, setPreview] = useState<{
        item: MovieDto
        left: number
        top: number
        align: "left" | "center" | "right"
    } | null>(null)

    const scroll = (dir: "left" | "right") => {
        if (!rowRef.current) return

        const container = rowRef.current
        const width = container.clientWidth
        const maxScrollLeft = container.scrollWidth - container.clientWidth

        if (dir === "right") {
            if (container.scrollLeft >= maxScrollLeft - 10) {
                container.scrollTo({ left: 0, behavior: "smooth" })
            } else {
                container.scrollBy({ left: width, behavior: "smooth" })
            }
        } else {
            if (container.scrollLeft <= 0) {
                container.scrollTo({ left: maxScrollLeft, behavior: "smooth" })
            } else {
                container.scrollBy({ left: -width, behavior: "smooth" })
            }
        }
    }

    const handleMouseEnter = (
        item: MovieDto,
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        if (!containerRef.current) return

        const cardRect = e.currentTarget.getBoundingClientRect()
        const containerRect = containerRef.current.getBoundingClientRect()
        const viewportPadding = 24
        const previewHalfHeight = 230
        const relativeRight = window.innerWidth - cardRect.right

        let left = cardRect.left + cardRect.width / 2
        let top = cardRect.top + cardRect.height / 2
        let align: "left" | "center" | "right" = "center"

        top = Math.min(
            Math.max(top, previewHalfHeight + viewportPadding),
            window.innerHeight - previewHalfHeight - viewportPadding
        )

        if (cardRect.left < 100) {
            left = cardRect.left
            align = "left"
        } else if (relativeRight < 100) {
            left = cardRect.right
            align = "right"
        }

        openTimeout.current = setTimeout(() => {
            setPreview({
                item,
                left: left - containerRect.left,
                top: top - containerRect.top,
                align
            })
        }, 700)
    }

    const handleMouseLeave = () => {
        if (openTimeout.current) clearTimeout(openTimeout.current)
        closeTimeout.current = setTimeout(() => {
            setPreview(null)
        }, 300)
    }

    return (
        <div ref={containerRef} className="group relative px-6 md:px-12">
            <div className="mb-4 flex items-end justify-between">
                <h2 className="text-base font-medium tracking-normal text-white/90 md:text-lg">
                    {title}
                </h2>
                <div className="hidden h-px flex-1 bg-linear-to-r from-white/10 to-transparent md:ml-5 md:block" />
            </div>

            <button
                onClick={() => scroll("left")}
                aria-label={`Scroll ${title} left`}
                className="absolute left-2 top-[calc(50%+14px)] z-20 flex h-20 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-[#08090b]/70 opacity-0 shadow-[0_16px_34px_rgba(0,0,0,0.45)] backdrop-blur-md transition duration-200 hover:bg-white/15 group-hover:opacity-100 md:left-6"
            >
                <ChevronLeft className="h-5 w-5 text-white/80" />
            </button>

            <div
                ref={rowRef}
                className="scrollbar-hide flex gap-3 overflow-x-auto overflow-y-visible scroll-smooth py-1 md:gap-4"
            >
                {items.map((item) => (
                    <Link key={item.id} to={`/movie/${item.id}`}>
                        <div
                            className="group/card relative w-[240px] flex-shrink-0 cursor-pointer overflow-hidden rounded-md border border-white/10 bg-white/5 shadow-[0_18px_40px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 md:w-[280px]"
                            onMouseEnter={(e) => handleMouseEnter(item, e)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <img
                                src={item.thumbnailUrl}
                                alt={item.title}
                                className="aspect-video w-full object-cover transition duration-500 group-hover/card:scale-[1.03]"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent opacity-0 transition duration-300 group-hover/card:opacity-100" />
                            <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-3 opacity-0 transition duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100">
                                <p className="truncate text-sm font-medium text-white">
                                    {item.title}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <button
                onClick={() => scroll("right")}
                aria-label={`Scroll ${title} right`}
                className="absolute right-2 top-[calc(50%+14px)] z-20 flex h-20 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-[#08090b]/70 opacity-0 shadow-[0_16px_34px_rgba(0,0,0,0.45)] backdrop-blur-md transition duration-200 hover:bg-white/15 group-hover:opacity-100 md:right-6"
            >
                <ChevronRight className="h-5 w-5 text-white/80" />
            </button>

            {preview && (
                <MoviePreview
                    key={preview.item.id}
                    item={items.find(i => i.id === preview.item.id) || preview.item}
                    left={preview.left}
                    top={preview.top}
                    align={preview.align}
                    cancelClose={() => {
                        if (closeTimeout.current) clearTimeout(closeTimeout.current)
                    }}
                    close={() => setPreview(null)}
                />
            )}
        </div>
    )
}
