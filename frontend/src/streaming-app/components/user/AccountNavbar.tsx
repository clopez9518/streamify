import { LogIn } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router"
import { useAuthStore } from "@/store/auth.store"
import { UserDropdown } from "./UserDropdown"

export const AccountNavbar = () => {

    const [scrolled, setScrolled] = useState(false)
    const { user } = useAuthStore()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <nav className={`dark fixed left-0 right-0 top-0 z-50 px-6 py-4 transition-all duration-300 lg:px-12 
        ${scrolled ? "border-b border-white/10 bg-[#08090b]/90 shadow-[0_18px_48px_rgba(0,0,0,0.26)] backdrop-blur-xl" : "bg-linear-to-b from-black/70 to-transparent"
            }`}>
            <div className="flex items-center justify-between">
                <Link to="/" className="text-xl font-semibold tracking-normal text-white">
                    STREAMIFY
                </Link>

                <div className="flex items-center gap-6">
                    {user
                        ? <UserDropdown user={user} />
                        : (
                            <Link
                                to="/auth/login"
                                className="inline-flex h-9 items-center gap-2 rounded-md border border-white/15 bg-white/10 px-4 text-sm font-medium text-white shadow-[0_12px_28px_rgba(0,0,0,0.22)] backdrop-blur-md transition hover:border-white/30 hover:bg-white/15"
                            >
                                <LogIn className="h-4 w-4" />
                                Login
                            </Link>
                        )
                    }
                </div>
            </div>
        </nav>
    )
}
