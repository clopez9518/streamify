import type { AuthResponse } from "@/interfaces/auth/auth.interface"
import type { User } from "@/interfaces/entities/user.interface"
import { loginAction, logoutAction, refreshTokenAction, registerAction, selectProfileAction } from "@/streaming-app/actions/auth/auth.actions"
import { create } from "zustand"
import { useProfileStore } from './profile.store'

type AuthStatus = 'Authenticated' | 'Unauthenticated' | 'Loading'

interface AuthState {
    user: User | null
    token: string | null
    status: AuthStatus
    isAuthReady: boolean

    setToken: (token: string) => void
    clearToken: () => void

    login: (email: string, password: string) => Promise<boolean>
    register: (email: string, password: string, passwordConfirmation: string) => Promise<boolean>
    logout: () => Promise<void>

    refreshToken: () => Promise<AuthResponse>
    selectProfile: (profileId: number) => Promise<AuthResponse>
    initAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    status: 'Unauthenticated',
    isAuthReady: false,

    setToken: (token: string) => set({ token, status: 'Authenticated' }),

    clearToken: () => set({ token: null, user: null, status: 'Unauthenticated' }),

    login: async (email: string, password: string) => {
        set({ status: 'Loading' })
        try {
            const response = await loginAction({ email, password })

            set({
                token: response.accessToken,
                user: response.user,
                status: 'Authenticated'
            })

            return true
        } catch {
            set({ status: 'Unauthenticated' })
            return false
        }
    },

    register: async (email: string, password: string, passwordConfirm: string) => {
        set({ status: 'Loading' })
        try {
            const response = await registerAction({ email, password, passwordConfirm })

            set({
                token: response.accessToken,
                user: response.user,
                status: 'Authenticated'
            })

            return true
        } catch {
            set({ status: 'Unauthenticated' })
            return false
        }
    },

    logout: async () => {
        await logoutAction()
        set({ token: null, user: null, status: 'Unauthenticated' })
        useProfileStore.getState().clearActiveProfile()
    },

    refreshToken: async () => {
        try {
            const response = await refreshTokenAction()

            set({
                token: response.accessToken,
                user: response.user,
                status: 'Authenticated'
            })

            return response
        } catch (error) {
            set({
                token: null,
                user: null,
                status: 'Unauthenticated'
            })
            useProfileStore.getState().clearActiveProfile()
            throw error
        }
    },

    selectProfile: async (profileId: number) => {
        try {
            const response = await selectProfileAction(profileId)

            set({
                token: response.accessToken,
                user: response.user,
                status: 'Authenticated'
            })

            return response
        } catch (error) {
            set({
                token: null,
                user: null,
                status: 'Unauthenticated'
            })
            useProfileStore.getState().clearActiveProfile()
            throw error
        }
    },

    initAuth: async () => {
        try {
            await Promise.race([
                useAuthStore.getState().refreshToken(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("timeout")), 3000)
                )
            ]);
        } catch {
            // Unauthenticated or timeout on initial load is expected
        } finally {
            set({ isAuthReady: true })
        }
    }
}))