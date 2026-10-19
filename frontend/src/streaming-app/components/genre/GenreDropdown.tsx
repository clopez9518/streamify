import { ChevronDown } from "lucide-react"
import { Link } from "react-router"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getGenres } from "@/streaming-app/hooks/useGenre"

export const GenreDropdown = () => {

    const { data: genres } = getGenres()

    if (!genres) {
        return null
    }

    return (
        <div className="pointer-events-auto inline-flex">
            <DropdownMenu dir="ltr">
                <DropdownMenuTrigger asChild>
                    <button className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-white/15 bg-[#08090b]/55 px-4 text-sm font-medium text-white shadow-[0_16px_36px_rgba(0,0,0,0.28)] backdrop-blur-xl transition hover:border-white/30 hover:bg-white/10">
                        Genres
                        <ChevronDown className="h-4 w-4 text-white/70" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    className="dark mt-3 w-[min(520px,calc(100vw-48px))] border-white/10 bg-[#101216]/95 p-3 text-white shadow-[0_28px_80px_rgba(0,0,0,0.48)] backdrop-blur-xl"
                    align="start"
                >
                    <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                        {genres.map((genre) => (
                            <DropdownMenuItem key={genre.id} asChild>
                                <Link
                                    to={`/browse/${genre.name.toLowerCase()}`}
                                    className="cursor-pointer rounded-md px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
                                >
                                    {genre.name}
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
