import { Suspense } from "react"
import { Outlet } from "react-router"
import { AdminSidebar } from "../components/AdminSidebar"
import { AdminNavbar } from "../components/AdminNavbar"
import { Loading } from "@/streaming-app/components/shared"

export const AdminLayout = () => {
    return (
        <div className="dark flex min-h-screen w-full bg-[#08090b] text-white">
            <AdminSidebar />

            <div className="flex min-w-0 flex-1 flex-col">
                <AdminNavbar />

                <main className="relative flex-1 overflow-hidden">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-linear-to-b from-black/55 via-[#08090b]/70 to-transparent" />
                    <div className="relative mx-auto w-full p-6 md:p-8">
                        <Suspense fallback={<Loading />}>
                            <Outlet />
                        </Suspense>
                    </div>
                </main>
            </div>
        </div>
    )
}
