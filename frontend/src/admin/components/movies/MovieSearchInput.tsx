import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import type { TmdbMovieDto } from "@/interfaces/dto/tmdb.dto"
import { getTmdbMovies } from "@/admin/hooks/useAdminMovies"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command"

export const MovieSearchInput = ({ onSelect }: { onSelect: (movie: TmdbMovieDto) => void }) => {
    const [query, setQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedQuery(query)
        }, 400)

        return () => clearTimeout(timeout)
    }, [query])

    const { data = [], isLoading } = getTmdbMovies(debouncedQuery)

    const handleSelect = (movie: TmdbMovieDto) => {
        onSelect(movie)
        setQuery("")
    }

    return (
        <Command className="dark overflow-hidden rounded-md border border-white/10 bg-[#08090b]/70 text-white shadow-none">
            <div className="flex items-center border-b border-white/10 px-3">
                <Search className="mr-2 h-4 w-4 text-white/50" />
                <CommandInput
                    placeholder="Search TMDB by title..."
                    value={query}
                    onValueChange={setQuery}
                    className="h-11 text-white placeholder:text-white/40"
                />
            </div>

            <CommandList className="max-h-80">
                {isLoading && (
                    <div className="p-3 text-sm text-white/50">
                        Searching TMDB...
                    </div>
                )}

                {!isLoading && data.length === 0 && debouncedQuery && (
                    <CommandEmpty className="py-6 text-sm text-white/50">
                        No movies found.
                    </CommandEmpty>
                )}

                <CommandGroup>
                    {data.map((movie) => (
                        <CommandItem
                            key={movie.id}
                            value={`${movie.title}-${movie.id}`}
                            onSelect={() => handleSelect(movie)}
                            className="flex min-h-[68px] cursor-pointer items-center gap-3 px-3 py-2 text-white data-[selected=true]:bg-white/10"
                        >
                            {movie.poster_path ? (
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    className="h-14 w-10 rounded object-cover"
                                />
                            ) : (
                                <div className="flex h-14 w-10 items-center justify-center rounded border border-white/10 bg-white/5 text-xs text-white/40">
                                    No art
                                </div>
                            )}

                            <div className="min-w-0">
                                <span className="block truncate text-sm font-medium">{movie.title}</span>
                                {movie.release_date && (
                                    <span className="text-xs text-white/50">
                                        {movie.release_date}
                                    </span>
                                )}
                            </div>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    )
}
