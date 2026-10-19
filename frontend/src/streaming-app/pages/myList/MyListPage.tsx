import { BookmarkPlus, LogIn, Search } from "lucide-react"
import type { ReactNode } from "react"
import { Link } from "react-router"
import { MovieGrid } from "@/streaming-app/components/movie/MovieGrid"
import { Error, Loading } from "@/streaming-app/components/shared"
import { useProfileStore } from "@/store/profile.store"
import { useGetMyList } from "@/streaming-app/hooks/useMyList"

export const MyListPage = () => {

    const { activeProfile } = useProfileStore()
    const { data: movies, isLoading, error } = useGetMyList(activeProfile?.id.toString() || "")

    if (isLoading) {
        return <Loading />
    }

    if (error) {
        return <Error title="Error fetching your list" />
    }

    return (
        <div className="dark relative min-h-screen overflow-hidden bg-[#08090b] px-6 pb-24 pt-28 text-white lg:px-12">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b from-black/60 via-[#08090b]/70 to-transparent" />

            <section className="relative mx-auto max-w-7xl">
                <div className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-white/50">
                            Personal shelf
                        </p>
                        <h1 className="text-4xl font-semibold leading-tight tracking-normal text-white md:text-6xl">
                            My List
                        </h1>
                    </div>

                    {activeProfile && movies && movies.length > 0 && (
                        <p className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/60">
                            {movies.length} {movies.length === 1 ? "saved title" : "saved titles"}
                        </p>
                    )}
                </div>

                {!activeProfile && (
                    <EmptyState
                        icon={<LogIn className="h-6 w-6" />}
                        title="Choose a profile to build your list"
                        description="Sign in or select a profile before saving titles for later."
                        action={
                            <Link
                                to="/auth/login"
                                className="inline-flex h-10 items-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/90"
                            >
                                <LogIn className="h-4 w-4" />
                                Login
                            </Link>
                        }
                    />
                )}

                {activeProfile && movies?.length === 0 && (
                    <EmptyState
                        icon={<BookmarkPlus className="h-6 w-6" />}
                        title="Your list is empty"
                        description="Browse the catalog and add anything you want to revisit."
                        action={
                            <Link
                                to="/browse"
                                className="inline-flex h-10 items-center gap-2 rounded-md border border-white/15 bg-white/10 px-4 text-sm font-medium text-white backdrop-blur-md transition hover:border-white/30 hover:bg-white/15"
                            >
                                <Search className="h-4 w-4" />
                                Browse titles
                            </Link>
                        }
                    />
                )}

                {activeProfile && movies && movies.length > 0 && (
                    <div className="-mx-6 lg:-mx-12">
                        <MovieGrid movies={movies} eyebrow="Saved" title="Your favorites" />
                    </div>
                )}
            </section>
        </div>
    )
}

type EmptyStateProps = {
    icon: ReactNode
    title: string
    description: string
    action: ReactNode
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
    return (
        <div className="flex min-h-[42vh] items-center justify-center">
            <div className="max-w-md rounded-md border border-white/10 bg-white/5 p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.32)]">
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white/80">
                    {icon}
                </div>
                <h2 className="text-2xl font-semibold tracking-normal text-white">
                    {title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/60">
                    {description}
                </p>
                <div className="mt-6">
                    {action}
                </div>
            </div>
        </div>
    )
}
