import { Suspense } from "react";
import { Outlet } from "react-router";
import { Loading } from "../components/shared";

export const AuthLayout = () => {
    return (
        <div className="min-h-screen w-full bg-[#08090b] text-white dark flex items-center justify-center p-4">
            <Suspense fallback={<Loading />}>
                <Outlet />
            </Suspense>
        </div>
    )
}