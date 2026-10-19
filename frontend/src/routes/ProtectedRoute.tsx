import { useAuthStore } from "@/store/auth.store";
import { Loading } from "@/streaming-app/components/shared";
import { Navigate } from "react-router";
import type { PropsWithChildren } from "react";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {

    const { status, isAuthReady } = useAuthStore();

    if (!isAuthReady || status === 'Loading') {
        return <Loading />
    }

    if (status === 'Unauthenticated') {
        return <Navigate to="/auth/login" replace />
    }

    return children;
}
