import { Suspense } from "react"
import { Outlet } from "react-router"
import { Navbar, Loading } from "../components/shared"
import { Footer } from "../components/shared/Footer"
import { ScrollToTop } from "../components/shared/ScrollToTop"

export const RootLayout = () => {
  return (
    <div className="min-h-screen bg-background dark">
      <Navbar />
      <ScrollToTop />
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
      <Footer />
    </div>
  )
}
