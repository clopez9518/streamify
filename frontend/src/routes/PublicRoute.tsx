import { useAuthStore } from "@/store/auth.store";
import { Loading } from "@/streaming-app/components/shared";
import type { PropsWithChildren } from "react";

export const PublicRoute = ({ children }: PropsWithChildren) => {

    const { status, isAuthReady } = useAuthStore();

    if (!isAuthReady || status === 'Loading') {
        return <Loading />
    }
    return children;
}
