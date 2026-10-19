import { Calendar, Film, Plus, Star, TrendingUp, Users } from "lucide-react"
import type { ReactNode } from "react"
import { Link } from "react-router"
import { Error, Loading } from "@/streaming-app/components/shared"
import { useAdminUsers } from "../hooks/useAdminUsers"
import { getMoviesAdmin } from "../hooks/useAdminMovies"

export const AdminDashboard = () => {

    const { data: movies, isLoading, error } = getMoviesAdmin()
    const { users } = useAdminUsers()

    if (isLoading) return <Loading />
    if (error) return <Error title={error.message} />

    const totalMovies = movies?.length ?? 0
    const totalUsers = users?.length ?? 0
    const activeMovies = movies?.filter(movie => movie.isActive).length ?? 0
    const averageRating = totalMovies
        ? (movies?.reduce((sum, movie) => sum + movie.rating, 0) ?? 0) / totalMovies
        : 0
    const topRatedMovie = movies?.reduce((prev, current) =>
        prev.rating > current.rating ? prev : current
    )
    const latestMovies = [...movies ?? []]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4)

    return (
        <div className="space-y-8">
            <section className="rounded-md border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)] md:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-white/50">
                            Admin console
                        </p>
                        <h1 className="text-4xl font-semibold leading-tight tracking-normal text-white md:text-5xl">
                            Dashboard
                        </h1>
                        <p className="mt-4 text-sm leading-6 text-white/60 md:text-base">
                            Monitor catalog health, users, and the latest additions from a focused control surface.
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

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    icon={<Film className="h-5 w-5" />}
                    label="Total Movies"
                    value={totalMovies.toLocaleString()}
                    detail={`${activeMovies.toLocaleString()} active titles`}
                />
                <MetricCard
                    icon={<Users className="h-5 w-5" />}
                    label="Total Users"
                    value={totalUsers.toLocaleString()}
                    detail="Registered accounts"
                />
                <MetricCard
                    icon={<Star className="h-5 w-5" />}
                    label="Average Rating"
                    value={averageRating.toFixed(1)}
                    detail="Across the catalog"
                />
                <MetricCard
                    icon={<TrendingUp className="h-5 w-5" />}
                    label="Top Rated"
                    value={topRatedMovie?.rating.toFixed(1) ?? "0.0"}
                    detail={topRatedMovie?.title ?? "No title available"}
                />
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-md border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
                    <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-white/50">
                                Recent activity
                            </p>
                            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-normal text-white">
                                <Calendar className="h-5 w-5 text-white/70" />
                                Recently added
                            </h2>
                        </div>
                        <Link to="/admin/movies" className="text-sm font-medium text-white/60 transition hover:text-white">
                            View all movies
                        </Link>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {latestMovies.map((movie) => (
                            <Link key={movie.id} to={`/admin/movies/${movie.id}/edit`}>
                                <article className="group overflow-hidden rounded-md border border-white/10 bg-[#08090b]/60 transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/10">
                                    <div className="relative aspect-video overflow-hidden">
                                        <img
                                            src={movie.backdropUrl}
                                            alt={movie.title}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-[#08090b] via-transparent to-transparent" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="truncate text-sm font-medium text-white">
                                            {movie.title}
                                        </h3>
                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/60">
                                            <span className="inline-flex items-center gap-1 text-white/70">
                                                <Star className="h-3 w-3 fill-current" />
                                                {movie.rating}
                                            </span>
                                            <span>/</span>
                                            <span>{movie.releaseYear}</span>
                                            <span>/</span>
                                            <span>{movie.isActive ? "Active" : "Inactive"}</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="rounded-md border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-white/50">
                        Spotlight
                    </p>
                    <h2 className="text-2xl font-semibold tracking-normal text-white">
                        Best performer
                    </h2>

                    <div className="mt-6 rounded-md border border-white/10 bg-[#08090b]/55 p-4">
                        <p className="text-sm text-white/50">
                            Most rated movie
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-white">
                            {topRatedMovie?.title ?? "No movie data"}
                        </h3>
                        <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
                            <Star className="h-4 w-4 fill-current text-white/80" />
                            <span>{topRatedMovie?.rating.toFixed(1) ?? "0.0"}</span>
                            <span>/</span>
                            <span>{topRatedMovie?.releaseYear ?? "Unknown year"}</span>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-white/60">
                            {topRatedMovie?.genres.map((genre) => genre.name).join(", ") || "No genres assigned"}
                        </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <Link
                            to="/admin/movies"
                            className="rounded-md border border-white/10 bg-white/5 px-3 py-3 text-sm font-medium text-white/70 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                        >
                            Manage catalog
                        </Link>
                        <Link
                            to="/admin/users"
                            className="rounded-md border border-white/10 bg-white/5 px-3 py-3 text-sm font-medium text-white/70 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                        >
                            Manage users
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

type MetricCardProps = {
    icon: ReactNode
    label: string
    value: string
    detail: string
}

const MetricCard = ({ icon, label, value, detail }: MetricCardProps) => {
    return (
        <div className="rounded-md border border-white/10 bg-white/5 p-5 shadow-[0_18px_42px_rgba(0,0,0,0.2)]">
            <div className="mb-5 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white/80">
                    {icon}
                </div>
                <div className="h-2 w-2 rounded-full bg-white/30" />
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
                {label}
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-normal text-white">
                {value}
            </p>
            <p className="mt-2 truncate text-sm text-white/60">
                {detail}
            </p>
        </div>
    )
}
