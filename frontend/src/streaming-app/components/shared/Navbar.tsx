import { useEffect, useState } from "react"
import { Link } from "react-router"
import { LogIn, Search, ShieldCheck } from "lucide-react"
import { UserDropdown } from "../user/UserDropdown"
import { useAuthStore } from "@/store/auth.store"
import { useProfileStore } from "@/store/profile.store"
import { SearchCommandDialog } from "./SearchCommandDialog"

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const { user } = useAuthStore()
    const { activeProfile } = useProfileStore()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Global keyboard shortcut for search dialog (Cmd+K or Ctrl+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setIsSearchOpen((prev) => !prev)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    return (
        <>
            <nav
                className={`dark fixed left-0 right-0 top-0 z-50 px-6 py-4 transition-all duration-300 lg:px-12 
                ${
                    scrolled
                        ? "border-b border-white/10 bg-[#08090b]/90 shadow-[0_18px_48px_rgba(0,0,0,0.26)] backdrop-blur-xl"
                        : "bg-linear-to-b from-black/70 to-transparent"
                }`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="text-xl font-semibold tracking-normal text-white">
                            STREAMIFY
                        </Link>

                        <div className="hidden md:flex items-center gap-6">
                            <Link to="/" className="text-sm text-white/70 transition-colors hover:text-white">
                                Home
                            </Link>
                            <Link to="/browse" className="text-sm text-white/70 transition-colors hover:text-white">
                                Browse
                            </Link>
                            <Link to="/mylist" className="text-sm text-white/70 transition-colors hover:text-white">
                                My List
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Search button trigger */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="Buscar películas (Ctrl+K)"
                            className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 backdrop-blur-md transition hover:border-white/30 hover:bg-white/10 hover:text-white cursor-pointer"
                        >
                            <Search className="h-4 w-4" />
                            <span className="hidden sm:inline">Buscar...</span>
                            <kbd className="hidden sm:inline-block rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-white/60">
                                ⌘K
                            </kbd>
                        </button>

                        {/* Kids Mode indicator badge */}
                        {activeProfile?.isKids && (
                            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                <span>Modo Niños</span>
                            </div>
                        )}

                        {user ? (
                            <UserDropdown user={user} />
                        ) : (
                            <Link
                                to="/auth/login"
                                className="inline-flex h-9 items-center gap-2 rounded-md border border-white/15 bg-white/10 px-4 text-sm font-medium text-white shadow-[0_12px_28px_rgba(0,0,0,0.22)] backdrop-blur-md transition hover:border-white/30 hover:bg-white/15"
                            >
                                <LogIn className="h-4 w-4" />
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <SearchCommandDialog
                open={isSearchOpen}
                onOpenChange={setIsSearchOpen}
            />
        </>
    )
}
