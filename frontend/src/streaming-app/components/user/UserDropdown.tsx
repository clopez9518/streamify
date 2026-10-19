import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User } from "@/interfaces/entities/user.interface";
import { useAuthStore } from "@/store/auth.store";
import { useProfileStore } from "@/store/profile.store";
import { useGetProfiles } from "@/streaming-app/hooks/useUsers";
import { Link } from "react-router";
import type { Profile } from "@/interfaces/entities/profile.interface";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface Props {
    user: User
}

export function UserDropdown({ user }: Props) {

    const queryClient = useQueryClient();
    const { logout, selectProfile } = useAuthStore();
    const { activeProfile, setActiveProfile } = useProfileStore();
    const { data: profiles, isLoading } = useGetProfiles();

    const handleProfileSelect = async (profile: Profile) => {
        await selectProfile(profile.id)
        queryClient.invalidateQueries({ queryKey: ["movies"] });
        queryClient.invalidateQueries({ queryKey: ["my-list"] });
        setActiveProfile(profile)
    }

    if (isLoading) {
        return <Loader2 className="animate-spin" />
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-white/15 bg-white/10 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.24)] backdrop-blur-md transition hover:bg-white/15">
                    {activeProfile ? activeProfile.name.charAt(0).toUpperCase() : user?.email.charAt(0).toUpperCase()}
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="mt-2 dark min-w-48">
                {/* <DropdownMenuItem asChild>
                    <Link to="/account">Profile</Link>
                </DropdownMenuItem> */}
                {
                    profiles?.map((profile) => (
                        <DropdownMenuItem key={profile.id} asChild>
                            <Link to="/" onClick={() => handleProfileSelect(profile)}>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-md border border-white/15 bg-white/10 text-xs font-semibold text-white">
                                                {profile.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span>{profile.name}</span>
                                        </div>
                                        {profile.isKids && (
                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                                Kids
                                            </span>
                                        )}
                                    </div>
                            </Link>
                        </DropdownMenuItem>
                    ))
                }
                <DropdownMenuItem asChild>
                    <Link to="/account">Account</Link>
                </DropdownMenuItem>

                {
                    user.role === 'admin' && (
                        <DropdownMenuItem asChild>
                            <Link to="/admin">Admin</Link>
                        </DropdownMenuItem>
                    )
                }

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
