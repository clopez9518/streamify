import type { ProfileDto } from "./profile.dto"

export interface UserAdminDto {
    id: number,
    email: string,
    role: string,
    lastLoginAt: Date | null,
    createdAt: Date,
    profiles: ProfileDto[],
    isActive: boolean
}

export interface UserChangeStatusDto {
    isActive: boolean
}