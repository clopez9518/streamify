import { useAuthStore } from "@/store/auth.store";
import { Loading } from "@/streaming-app/components/shared";
import { Navigate } from "react-router";
import type { PropsWithChildren } from "react";

export const AdminRoute = ({ children }: PropsWithChildren) => {

    const { status, isAuthReady, user } = useAuthStore();

    if (!isAuthReady || status === 'Loading') {
        return <Loading />
    }

    if (status === 'Unauthenticated') {
        return <Navigate to="/auth/login" replace />
    }

    if (status === 'Authenticated' && user?.role !== 'admin') {
        return <Navigate to="/" replace />
    }

    return children;
}
