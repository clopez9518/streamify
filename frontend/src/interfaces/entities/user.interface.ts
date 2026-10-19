import type { Profile } from "./profile.interface"

export interface User {
    id: string
    email: string
    role: string
    isActive: boolean
    createdAt: Date
    profiles: Profile[]
}