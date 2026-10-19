import { streamingApi } from "@/api/streaming.api"
import type { UserAdminDto, UserChangeStatusDto } from "@/interfaces/dto/user.dto"

export const getUsersAdminAction = async () => {
    const { data } = await streamingApi.get<UserAdminDto[]>('/users/admin')
    return data
}

export const changeUserStatusAction = async (id: string, isActive: boolean) => {
    const { data } = await streamingApi.patch<UserChangeStatusDto>(`/users/${id}/change-status`, { isActive })
    return data
}
