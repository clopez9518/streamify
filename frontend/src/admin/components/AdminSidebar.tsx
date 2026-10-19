import { ArrowLeft, Film, LayoutDashboard, Users } from "lucide-react"
import { Link, NavLink } from "react-router"
import { useAuthStore } from "@/store/auth.store"

const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/movies", label: "Movies", icon: Film },
    { to: "/admin/users", label: "Users", icon: Users },
]

export const AdminSidebar = () => {

    const { user } = useAuthStore()
    const initial = user?.email?.charAt(0).toUpperCase() ?? "A"

    return (
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-white/10 bg-[#08090b] p-4 lg:flex lg:flex-col">
            <Link
                to="/"
                className="mb-6 inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Streamify
            </Link>

            <div className="mb-6 rounded-md border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">
                    Workspace
                </p>
                <h2 className="mt-2 text-lg font-semibold text-white">
                    Admin Panel
                </h2>
                <p className="mt-2 text-sm leading-5 text-white/60">
                    Catalog and user operations.
                </p>
            </div>

            <nav className="flex-1">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon

                        return (
                            <li key={item.to}>
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${isActive
                                            ? "bg-white text-black shadow-[0_12px_28px_rgba(0,0,0,0.22)]"
                                            : "text-white/70 hover:bg-white/10 hover:text-white"
                                        }`
                                    }
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </NavLink>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            <div className="border-t border-white/10 pt-4">
                <div className="flex items-center gap-3 rounded-md border border-white/10 bg-white/5 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-white/10 text-sm font-semibold text-white">
                        {initial}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">
                            {user?.email ?? "Admin"}
                        </p>
                        <p className="truncate text-xs text-white/50">
                            {user?.role ?? "Administrator"}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    )
}
