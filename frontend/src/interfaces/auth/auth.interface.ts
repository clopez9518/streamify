import type { User } from "../entities/user.interface"

export interface AuthResponse {
    accessToken: string
    refreshToken: string
    expiresAt: Date
    user: User
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    email: string
    password: string
    passwordConfirm: string
}