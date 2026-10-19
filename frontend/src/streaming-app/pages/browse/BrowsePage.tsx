import { useEffect, useMemo } from "react"
import { useLocation } from "react-router"
import { MovieGrid } from "@/streaming-app/components/movie/MovieGrid"
import { Error, Hero, Loading, NotFound, PaginationComponent } from "@/streaming-app/components/shared"
import { getHeroMovie, getMovies } from "@/streaming-app/hooks/useMovies"
import { usePaginationParams } from "@/streaming-app/hooks/usePaginationParams"

export const BrowsePage = () => {

    const location = useLocation()
    const { page, pageSize, setParams } = usePaginationParams()
    const { movies, isLoading, error, totalPages, hasNextPage, hasPreviousPage } = getMovies()
    const { data: heroMovie } = getHeroMovie()

    const fallbackHeroMovie = useMemo(() => {
        if (!movies?.length) return undefined

        const stableIndex = ((page ?? 1) - 1) % movies.length
        return movies[stableIndex]
    }, [movies, page])

    useEffect(() => {
        if (isLoading || location.hash !== "#catalog") return

        requestAnimationFrame(() => {
            document.getElementById("catalog")?.scrollIntoView({ block: "start" })
        })
    }, [isLoading, location.hash, page])

    if (isLoading) {
        return <Loading />
    }

    if (error) {
        return <Error title="Error fetching movies" />
    }

    if (movies?.length === 0 || !movies) {
        return <NotFound title="No movies found" />
    }

    return (
        <div className="dark min-h-screen overflow-hidden bg-[#08090b] text-white">
            <Hero movie={heroMovie || fallbackHeroMovie || movies[0]} />

            <div className="relative z-10 -mt-28 pb-24">
                <div className="pointer-events-none absolute inset-x-0 -top-28 h-44 bg-linear-to-b from-transparent via-[#08090b]/80 to-[#08090b]" />

                <section id="catalog" className="relative scroll-mt-24 space-y-8">
                    <MovieGrid movies={movies} />

                    <PaginationComponent
                        page={page!}
                        totalPages={totalPages!}
                        hasNextPage={hasNextPage!}
                        hasPreviousPage={hasPreviousPage!}
                        onPageChange={(newPage) => setParams(newPage, pageSize, { hash: "catalog" })}
                    />
                </section>
            </div>
        </div>
    )
}
