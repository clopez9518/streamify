import { useChangeUserStatus } from "@/admin/hooks/useAdminUsers"
import type { UserAdminDto } from "@/interfaces/dto/user.dto"

export const UserActionsCell = ({ user }: { user: UserAdminDto }) => {
    const mutation = useChangeUserStatus()

    return (
        <div className="flex gap-2">
            <button
                type="button"
                className={`inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${user.isActive
                    ? "border-red-300/20 bg-red-400/10 text-red-100 hover:border-red-200/40 hover:bg-red-400/15"
                    : "border-emerald-300/20 bg-emerald-400/10 text-emerald-100 hover:border-emerald-200/40 hover:bg-emerald-400/15"
                    }`}
                onClick={() => mutation.mutate({ id: user.id.toString(), isActive: !user.isActive })}
                disabled={mutation.isPending}
            >
                {user.isActive
                    ? "Deactivate"
                    : "Activate"}
            </button>
        </div>
    )
}
