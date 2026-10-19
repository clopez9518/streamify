import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { changeUserStatusAction, getUsersAdminAction } from "../actions/user/AdminUser.action"
import { notify } from "@/lib/notify"

export const useAdminUsers = () => {
    const { data: users, isLoading, error } = useQuery({
        queryKey: ['admin-users'],
        queryFn: getUsersAdminAction,
    })

    return { users, isLoading, error }
}

export const useChangeUserStatus = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
            changeUserStatusAction(id, isActive),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] })
            notify.success('User status changed successfully')
        },
        onError: () => {
            notify.error('Error changing user status')
        },
    })
}