import { ArrowLeft, Film, Plus } from "lucide-react"
import type { ReactNode } from "react"
import { Link, useParams } from "react-router"
import { Error, Loading } from "@/streaming-app/components/shared"
import { getGenres } from "@/streaming-app/hooks/useGenre"
import { CreateMovieForm } from "../components/movies/CreateMovieForm"
import { EditMovieForm } from "../components/movies/EditMovieForm"
import { getMovieByIdAdmin } from "../hooks/useAdminMovies"

export const AdminMovieFormPage = () => {
    const { id } = useParams()

    return id ? <EditMoviePage id={id} /> : <CreateMoviePage />
}

const CreateMoviePage = () => {
    const { data: genres, isLoading, error } = getGenres()

    if (isLoading) return <Loading />
    if (error) return <Error title="Error loading genres" />

    return (
        <MovieFormShell
            mode="create"
            title="Create movie"
            description="Import metadata from TMDB, review the details, then publish a new catalog title."
        >
            <CreateMovieForm genres={genres || []} />
        </MovieFormShell>
    )
}

const EditMoviePage = ({ id }: { id: string }) => {
    const { data: genres, isLoading: isLoadingGenres, error: genresError } = getGenres()
    const { data: movie, isLoading: isLoadingMovie, error: movieError } = getMovieByIdAdmin(id)

    if (isLoadingGenres || isLoadingMovie) return <Loading />
    if (genresError) return <Error title="Error loading genres" />
    if (movieError) return <Error title="Error loading movie" />
    if (!movie) return <Error title="Movie not found" />

    return (
        <MovieFormShell
            mode="edit"
            title="Edit movie"
            description="Update catalog metadata, availability, people, and classification for this title."
        >
            <EditMovieForm movie={movie} genres={genres || []} />
        </MovieFormShell>
    )
}

type MovieFormShellProps = {
    mode: "create" | "edit"
    title: string
    description: string
    children: ReactNode
}

const MovieFormShell = ({ mode, title, description, children }: MovieFormShellProps) => {
    return (
        <div className="space-y-8">
            <section className="rounded-md border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)] md:p-8">
                <Link
                    to="/admin/movies"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/60 transition hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to movies
                </Link>

                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-3xl">
                        <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-white/50">
                            {mode === "create" ? "New title" : "Catalog edit"}
                        </p>
                        <h1 className="text-4xl font-semibold leading-tight tracking-normal text-white md:text-5xl">
                            {title}
                        </h1>
                        <p className="mt-4 text-sm leading-6 text-white/60 md:text-base">
                            {description}
                        </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white/80">
                        {mode === "create" ? <Plus className="h-5 w-5" /> : <Film className="h-5 w-5" />}
                    </div>
                </div>
            </section>

            {children}
        </div>
    )
}
