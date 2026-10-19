import { Navigate } from "react-router"
import { useAuthStore } from "@/store/auth.store"
import { useProfileStore } from "@/store/profile.store"


export const RequireProfileIfAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthReady, status } = useAuthStore()
  const activeProfile = useProfileStore((s) => s.activeProfile)
  const hasHydrated = useProfileStore.persist.hasHydrated()

  if (!hasHydrated) return null

  if (status === 'Unauthenticated' || !isAuthReady) return children

  if (!activeProfile) {
    return <Navigate to="/whos-watching" replace />
  }

  return children
}