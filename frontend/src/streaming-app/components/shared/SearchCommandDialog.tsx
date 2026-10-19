import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { Search, Star, Film, Loader2 } from "lucide-react"
import type { MovieDto } from "@/interfaces/dto/movie.dto"
import { searchMoviesAction } from "@/streaming-app/actions/movie/get-movies.action"
import {
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command"

interface SearchCommandDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const SearchCommandDialog = ({ open, onOpenChange }: SearchCommandDialogProps) => {
    const navigate = useNavigate()
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<MovieDto[]>([])
    const [isLoading, setIsLoading] = useState(false)

    // Debounced search query
    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            setIsLoading(false)
            return
        }

        const timer = setTimeout(async () => {
            try {
                setIsLoading(true)
                const movies = await searchMoviesAction(query)
                setResults(movies)
            } catch {
                setResults([])
            } finally {
                setIsLoading(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    const handleSelectMovie = (movieId: number) => {
        onOpenChange(false)
        setQuery("")
        navigate(`/movie/${movieId}`)
    }

    return (
        <CommandDialog
            open={open}
            onOpenChange={onOpenChange}
            shouldFilter={false}
            className="dark bg-[#0e1017] border border-white/15 text-white shadow-2xl max-w-2xl"
        >
            <CommandInput
                placeholder="Buscar películas por título, género o actor... (Ctrl + K)"
                value={query}
                onValueChange={setQuery}
                className="text-white placeholder:text-white/40"
            />

            <CommandList className="max-h-96 text-white overflow-y-auto">
                {isLoading && (
                    <div className="flex items-center justify-center gap-2 py-6 text-sm text-white/50">
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        <span>Buscando en el catálogo...</span>
                    </div>
                )}

                {!isLoading && query.trim() !== "" && results.length === 0 && (
                    <CommandEmpty className="py-8 text-center text-sm text-white/50">
                        <Film className="mx-auto h-8 w-8 text-white/20 mb-2" />
                        No se encontraron películas para "{query}"
                    </CommandEmpty>
                )}

                {!isLoading && results.length > 0 && (
                    <CommandGroup heading={`Resultados (${results.length})`}>
                        {results.map((movie) => (
                            <CommandItem
                                key={movie.id}
                                value={`${movie.title} ${movie.releaseYear}`}
                                onSelect={() => handleSelectMovie(movie.id)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                            >
                                <img
                                    src={movie.thumbnailUrl}
                                    alt={movie.title}
                                    className="h-12 w-9 rounded object-cover border border-white/10 shrink-0"
                                />
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className="text-sm font-medium text-white truncate">
                                        {movie.title}
                                    </span>
                                    <span className="text-xs text-white/50 truncate">
                                        {movie.releaseYear} • {movie.genres?.map(g => g.name).join(", ")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold shrink-0">
                                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                                    <span>{movie.rating.toFixed(1)}</span>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}

                {!query.trim() && (
                    <div className="py-8 text-center text-xs text-white/40">
                        <Search className="mx-auto h-6 w-6 text-white/20 mb-2" />
                        Escribe el nombre de una película o género para comenzar
                    </div>
                )}
            </CommandList>
        </CommandDialog>
    )
}
