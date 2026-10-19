import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";

import {
    RootLayout,
    AuthLayout,
    BrowseLayout,
    AccountLayout,
} from "./streaming-app/layouts";
import { AdminLayout } from "./admin/layouts/AdminLayout";
import { AdminRoute, ProtectedRoute, PublicRoute } from "./routes";
import { RequireProfileIfAuth } from "./routes/RequireProfileIfAuth";
import { Loading } from "./streaming-app/components/shared";

// Lazy-loaded routes for code-splitting
const HomePage = lazy(() => import("./streaming-app/pages/home/HomePage").then((m) => ({ default: m.HomePage })));
const BrowsePage = lazy(() => import("./streaming-app/pages/browse/BrowsePage").then((m) => ({ default: m.BrowsePage })));
const GenrePage = lazy(() => import("./streaming-app/pages/genre/GenrePage").then((m) => ({ default: m.GenrePage })));
const MoviePage = lazy(() => import("./streaming-app/pages/movie/MoviePage").then((m) => ({ default: m.MoviePage })));
const MyListPage = lazy(() => import("./streaming-app/pages/myList/MyListPage").then((m) => ({ default: m.MyListPage })));
const LoginPage = lazy(() => import("./streaming-app/pages/login/LoginPage").then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("./streaming-app/pages/register/RegisterPage").then((m) => ({ default: m.RegisterPage })));
const AccountPage = lazy(() => import("./streaming-app/pages/account/AccountPage").then((m) => ({ default: m.AccountPage })));
const ProfilePage = lazy(() => import("./streaming-app/pages/profile/ProfilePage").then((m) => ({ default: m.ProfilePage })));
const WhosWatchingPage = lazy(() => import("./streaming-app/pages/WhosWatching/WhosWatchingPage").then((m) => ({ default: m.WhosWatchingPage })));

const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard").then((m) => ({ default: m.AdminDashboard })));
const AdminMovies = lazy(() => import("./admin/pages/AdminMovies").then((m) => ({ default: m.AdminMovies })));
const AdminMovieFormPage = lazy(() => import("./admin/pages/AdminMovieFormPage").then((m) => ({ default: m.AdminMovieFormPage })));
const AdminUsers = lazy(() => import("./admin/pages/AdminUsers").then((m) => ({ default: m.AdminUsers })));

export const appRouter = createBrowserRouter(
    [
        {
            path: '/',
            element: (
                <PublicRoute>
                    <RequireProfileIfAuth>
                        <RootLayout />
                    </RequireProfileIfAuth>
                </PublicRoute>
            ),
            children: [
                {
                    index: true,
                    element: <HomePage />
                },
                {
                    path: 'browse',
                    element: <BrowseLayout />,
                    children: [
                        {
                            index: true,
                            element: <BrowsePage />
                        },
                        {
                            path: ':genre',
                            element: <GenrePage />
                        }
                    ]
                },
                {
                    path: 'movie/:id',
                    element: <MoviePage />
                },
                {
                    path: 'mylist',
                    element: <MyListPage />
                }
            ]
        },
        {
            path: 'auth',
            element: <AuthLayout />,
            children: [
                {
                    path: 'login',
                    element: <LoginPage />
                },
                {
                    path: 'register',
                    element: <RegisterPage />
                }
            ]
        },
        {
            path: 'account',
            element: (
                <ProtectedRoute>
                    <AccountLayout />
                </ProtectedRoute>
            ),
            children: [
                {
                    index: true,
                    element: <AccountPage />
                },
                {
                    path: 'profile',
                    element: <ProfilePage />
                }
            ]
        },
        {
            path: 'whos-watching',
            element: (
                <ProtectedRoute>
                    <Suspense fallback={<Loading />}>
                        <WhosWatchingPage />
                    </Suspense>
                </ProtectedRoute>
            )
        },

        // Admin routes
        {
            path: 'admin',
            element: (
                <AdminRoute>
                    <AdminLayout />
                </AdminRoute>
            ),
            children: [
                {
                    index: true,
                    element: <Navigate to="dashboard" replace />
                },
                {
                    path: 'dashboard',
                    element: <AdminDashboard />
                },
                {
                    path: 'movies',
                    element: <AdminMovies />
                },
                {
                    path: 'movies/new',
                    element: <AdminMovieFormPage />
                },
                {
                    path: "movies/:id/edit",
                    element: <AdminMovieFormPage />
                },
                {
                    path: "users",
                    element: <AdminUsers />
                }
            ]
        },

        {
            path: '*',
            element: <Navigate to="/" replace />
        }
    ]
)