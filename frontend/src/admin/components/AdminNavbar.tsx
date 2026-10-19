import { Shield } from "lucide-react"
import { Link, NavLink } from "react-router"
import { useAuthStore } from "@/store/auth.store"
import { UserDropdown } from "@/streaming-app/components/user/UserDropdown"

const mobileNavItems = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/movies", label: "Movies" },
    { to: "/admin/users", label: "Users" },
]

export const AdminNavbar = () => {

    const { user } = useAuthStore()

    return (
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#08090b]/90 px-6 py-4 shadow-[0_18px_48px_rgba(0,0,0,0.26)] backdrop-blur-xl md:px-8">
            <div className="flex items-center justify-between gap-6">
                <div className="min-w-0">
                    <Link to="/admin/dashboard" className="text-xl font-semibold tracking-normal text-white">
                        STREAMIFY
                    </Link>
                    <p className="mt-1 hidden text-xs uppercase tracking-[0.22em] text-white/50 sm:block">
                        Admin console
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 md:inline-flex">
                        <Shield className="h-4 w-4" />
                        {user?.role ?? "Admin"}
                    </div>

                    {user && <UserDropdown user={user} />}
                </div>
            </div>

            <nav className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
                {mobileNavItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `shrink-0 rounded-md border px-3 py-2 text-sm transition ${isActive
                                ? "border-white bg-white text-black"
                                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                            }`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </header>
    )
}
