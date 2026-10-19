import { RouterProvider } from "react-router"
import { appRouter } from "./app.router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useAuthStore } from "./store/auth.store";
import { useEffect } from "react";
import { Loading } from "./streaming-app/components/shared";
import { Toaster } from "sonner";


const queryClient = new QueryClient();

export const StreamingApp = () => {

  const { initAuth, isAuthReady } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, []);

  if (!isAuthReady) {
    return <Loading />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors position="top-center" closeButton theme="dark" />
      <RouterProvider router={appRouter} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
