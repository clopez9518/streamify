import { Suspense } from "react";
import { Outlet } from "react-router";
import { AccountNavbar } from "../components/user/AccountNavbar";
import { Footer, Loading } from "../components/shared";
import { AccountSidebar } from "../components/user/AccountSidebar";

export const AccountLayout = () => {
    return (
        <div className="dark min-h-screen overflow-hidden bg-[#08090b] text-white">
            <AccountNavbar />

            <div className="relative px-6 pb-24 pt-28 lg:px-12">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-linear-to-b from-black/60 via-[#08090b]/70 to-transparent" />

                <div className="relative mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-start">
                    <AccountSidebar />

                    <main className="min-w-0 flex-1">
                        <Suspense fallback={<Loading />}>
                            <Outlet />
                        </Suspense>
                    </main>
                </div>
            </div>

            <Footer />
        </div>
    )
}
