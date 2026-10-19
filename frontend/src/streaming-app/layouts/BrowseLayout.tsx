import { Suspense } from "react"
import { Outlet } from "react-router"
import { GenreDropdown } from "../components/genre/GenreDropdown"
import { Loading } from "../components/shared"

export const BrowseLayout = () => {
    return (
        <div className="relative bg-[#08090b]">
            <Suspense fallback={<Loading />}>
                <Outlet />
            </Suspense>
            <div className="pointer-events-none absolute left-0 right-0 top-0 z-30 px-6 pt-20 md:pt-24 lg:px-12">
                <GenreDropdown />
            </div>
        </div>
    )
}
