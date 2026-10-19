import { ArrowLeft, CreditCard, Home, Lock, User } from "lucide-react"
import { Link, NavLink } from "react-router"
import { useAuthStore } from "@/store/auth.store"

const navItems = [
    { to: "/account", label: "Account", icon: Home, end: true },
    { to: "/account/profile", label: "Profiles", icon: User },
]

const disabledItems = [
    { label: "Security", icon: Lock },
    { label: "Billing", icon: CreditCard },
]

export function AccountSidebar() {
    const { user } = useAuthStore()
    const initial = user?.email?.charAt(0).toUpperCase() ?? "S"

    return (
        <aside className="w-full shrink-0 rounded-md border border-white/10 bg-white/5 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.24)] lg:sticky lg:top-28 lg:w-72">
            <Link
                to="/"
                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Streamify
            </Link>

            <nav className="space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon

                    return (
                        <NavLink
                            key={item.label}
                            to={item.to}
                            end={item.end}
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
                    )
                })}

                {disabledItems.map((item) => {
                    const Icon = item.icon

                    return (
                        <div
                            key={item.label}
                            className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm text-white/40"
                        >
                            <div className="flex items-center gap-3">
                                <Icon className="h-4 w-4" />
                                <span>{item.label}</span>
                            </div>
                            <span className="text-xs">Soon</span>
                        </div>
                    )
                })}
            </nav>

            <div className="mt-6 border-t border-white/10 pt-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-white/10 text-sm font-semibold text-white">
                        {initial}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                            {user?.email ?? "Guest"}
                        </p>
                        <p className="text-xs text-white/50">
                            Account settings
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    )
}
