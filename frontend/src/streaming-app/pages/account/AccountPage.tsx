import { Mail, ShieldAlert, UserRound } from "lucide-react"
import type { ReactNode } from "react"
import { Error, Loading } from "@/streaming-app/components/shared"
import { useAuthStore } from "@/store/auth.store"
import { useGetProfiles } from "@/streaming-app/hooks/useUsers"

export const AccountPage = () => {
    const { user } = useAuthStore()
    const { data: profiles, isLoading, error } = useGetProfiles()

    if (isLoading) return <Loading />
    if (error) return <Error title={error.message} />

    return (
        <div className="space-y-8">
            <section className="rounded-md border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)] md:p-8">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-white/50">
                    Settings
                </p>
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl font-semibold leading-tight tracking-normal text-white md:text-5xl">
                            Account
                        </h1>
                        <p className="mt-4 text-sm leading-6 text-white/60 md:text-base">
                            Manage your identity, profiles, and account preferences from one quiet place.
                        </p>
                    </div>

                    <div className="rounded-md border border-white/10 bg-[#08090b]/60 px-3 py-2 text-sm text-white/60">
                        {profiles?.length ?? 0} {profiles?.length === 1 ? "profile" : "profiles"}
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
                <InfoCard
                    icon={<Mail className="h-5 w-5" />}
                    label="Email"
                    value={user?.email ?? "No email available"}
                    helper="Used for sign-in and account notifications."
                />
                <InfoCard
                    icon={<UserRound className="h-5 w-5" />}
                    label="Role"
                    value={user?.role ?? "Member"}
                    helper="Access level for this Streamify account."
                />
            </section>

            <section className="rounded-md border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
                <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-white/50">
                            Profiles
                        </p>
                        <h2 className="text-2xl font-semibold tracking-normal text-white">
                            Watching profiles
                        </h2>
                    </div>
                    <p className="text-sm text-white/50">
                        {profiles?.length ?? 0} available
                    </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {profiles?.map((profile) => (
                        <div
                            key={profile.id}
                            className="flex items-center gap-3 rounded-md border border-white/10 bg-[#08090b]/50 p-3"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-md border border-white/15 bg-white/10 text-sm font-semibold text-white">
                                {profile.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-white">
                                    {profile.name}
                                </p>
                                <p className="text-xs text-white/50">
                                    {profile.isKids ? "Kids profile" : "Standard profile"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="rounded-md border border-red-400/20 bg-red-500/5 p-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-red-300/20 bg-red-400/10 text-red-200">
                            <ShieldAlert className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Deactivate account
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-white/60">
                                This action should be used carefully. Your profiles and saved titles may no longer be accessible.
                            </p>
                        </div>
                    </div>

                    <button className="inline-flex h-10 items-center justify-center rounded-md border border-red-300/25 bg-red-400/10 px-4 text-sm font-medium text-red-100 transition hover:border-red-200/45 hover:bg-red-400/15">
                        Deactivate
                    </button>
                </div>
            </section>
        </div>
    )
}

type InfoCardProps = {
    icon: ReactNode
    label: string
    value: string
    helper: string
}

const InfoCard = ({ icon, label, value, helper }: InfoCardProps) => {
    return (
        <div className="rounded-md border border-white/10 bg-white/5 p-5 shadow-[0_18px_42px_rgba(0,0,0,0.2)]">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white/80">
                {icon}
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
                {label}
            </p>
            <p className="mt-2 truncate text-lg font-medium text-white">
                {value}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/60">
                {helper}
            </p>
        </div>
    )
}
