import { streamingApi } from "@/api/streaming.api"
import type { AuthResponse, LoginRequest, RegisterRequest } from "@/interfaces/auth/auth.interface"

export const loginAction = async (request: LoginRequest) => {
    const response = await streamingApi.post<AuthResponse>('/auth/login', request)
    return response.data
}

export const registerAction = async (request: RegisterRequest) => {
    const response = await streamingApi.post<AuthResponse>('/auth/register', request)
    return response.data
}

export const refreshTokenAction = async () => {
    const response = await streamingApi.post<AuthResponse>('/auth/refresh')
    return response.data
}

export const selectProfileAction = async (profileId: number) => {
    const response = await streamingApi.post<AuthResponse>(`/auth/select-profile/${profileId}`)
    return response.data
}

export const logoutAction = async () => {
    const response = await streamingApi.post('/auth/logout')
    return response.data
}