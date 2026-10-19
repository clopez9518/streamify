import { ShieldCheck, UserCheck, Users } from "lucide-react"
import type { ReactNode } from "react"
import { Error, Loading } from "@/streaming-app/components/shared"
import { DataTable } from "../components/DataTable"
import { columns } from "../components/users/UsersColumns"
import { useAdminUsers } from "../hooks/useAdminUsers"

export const AdminUsers = () => {

    const { users, isLoading, error } = useAdminUsers()

    if (isLoading) return <Loading />
    if (error) return <Error title={error.message} />

    const totalUsers = users?.length ?? 0
    const activeUsers = users?.filter(user => user.isActive).length ?? 0
    const adminUsers = users?.filter(user => user.role === "admin").length ?? 0

    const inputFilter = {
        placeholder: "Filter users by email...",
        column: "email",
    }

    return (
        <div className="space-y-8">
            <section className="rounded-md border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)] md:p-8">
                <div className="max-w-3xl">
                    <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-white/50">
                        Identity operations
                    </p>
                    <h1 className="text-4xl font-semibold leading-tight tracking-normal text-white md:text-5xl">
                        Users
                    </h1>
                    <p className="mt-4 text-sm leading-6 text-white/60 md:text-base">
                        Review registered accounts, roles, access status, and recent activity.
                    </p>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <SummaryCard icon={<Users className="h-5 w-5" />} label="Total users" value={totalUsers.toLocaleString()} />
                <SummaryCard icon={<UserCheck className="h-5 w-5" />} label="Active users" value={activeUsers.toLocaleString()} />
                <SummaryCard icon={<ShieldCheck className="h-5 w-5" />} label="Admins" value={adminUsers.toLocaleString()} />
            </section>

            <DataTable columns={columns} data={users || []} inputFilter={inputFilter} />
        </div>
    )
}

const SummaryCard = ({ icon, label, value }: { icon: ReactNode; label: string; value: string }) => (
    <div className="rounded-md border border-white/10 bg-white/5 p-5 shadow-[0_18px_42px_rgba(0,0,0,0.2)]">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white/80">
            {icon}
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
            {label}
        </p>
        <p className="mt-2 text-3xl font-semibold text-white">
            {value}
        </p>
    </div>
)
