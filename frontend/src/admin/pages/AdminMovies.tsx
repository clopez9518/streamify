import { Film, Plus, Star } from "lucide-react"
import type { ReactNode } from "react"
import { Link } from "react-router"
import { DataTable } from "../components/DataTable"
import { columns } from "../components/movies/MoviesColumns"
import { getMoviesAdmin } from "../hooks/useAdminMovies"

export const AdminMovies = () => {

    const { data: movies } = getMoviesAdmin()
    const totalMovies = movies?.length ?? 0
    const activeMovies = movies?.filter(movie => movie.isActive).length ?? 0
    const averageRating = totalMovies
        ? (movies?.reduce((sum, movie) => sum + movie.rating, 0) ?? 0) / totalMovies
        : 0

    const inputFilter = {
        placeholder: "Filter movies by title...",
        column: "title",
    }

    return (
        <div className="space-y-8">
            <section className="rounded-md border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)] md:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-white/50">
                            Catalog operations
                        </p>
                        <h1 className="text-4xl font-semibold leading-tight tracking-normal text-white md:text-5xl">
                            Movies
                        </h1>
                        <p className="mt-4 text-sm leading-6 text-white/60 md:text-base">
                            Manage titles, metadata, availability, and editorial signals across the Streamify catalog.
                        </p>
                    </div>

                    <Link
                        to="/admin/movies/new"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-black shadow-[0_14px_34px_rgba(0,0,0,0.28)] transition hover:bg-white/90"
                    >
                        <Plus className="h-4 w-4" />
                        Create Movie
                    </Link>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <SummaryCard icon={<Film className="h-5 w-5" />} label="Total movies" value={totalMovies.toLocaleString()} />
                <SummaryCard icon={<Film className="h-5 w-5" />} label="Active titles" value={activeMovies.toLocaleString()} />
                <SummaryCard icon={<Star className="h-5 w-5" />} label="Average rating" value={averageRating.toFixed(1)} />
            </section>

            <DataTable columns={columns} data={movies || []} inputFilter={inputFilter} />
        </div>
    )
}

const SummaryCard = ({ icon, label, value }: { icon: ReactNode; label: string; value: string }) => (
    <div className="rounded-md border border-white/10 bg-white/5 p-5 shadow-[0_18px_42px_rgba(0,0,0,0.2)]">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white/80">
            {icon}
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
            {label}
        </p>
        <p className="mt-2 text-3xl font-semibold text-white">
            {value}
        </p>
    </div>
)
