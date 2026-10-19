import { getAccessToken, refreshToken, setAccessToken, clearAccessToken } from "@/helpers/auth.helper";
import axios from "axios";

let isRefreshing = false;
let failedQueue: {
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });

    failedQueue = [];
};

export const streamingApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

streamingApi.interceptors.request.use((config) => {

    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

streamingApi.interceptors.response.use((response) => response, async error => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
        return Promise.reject(error);
    }

    if (originalRequest._retry) {
        return Promise.reject(error);
    }

    if (originalRequest.url.includes("/auth/login")) {
        return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
    }

    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            failedQueue.push({
                resolve: (token: string) => {
                    originalRequest.headers["Authorization"] = `Bearer ${token}`;
                    resolve(streamingApi(originalRequest));
                },
                reject: (err: unknown) => reject(err),
            });
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
        const { accessToken } = await refreshToken();

        setAccessToken(accessToken);
        processQueue(null, accessToken);

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return streamingApi(originalRequest);
    } catch (err) {
        processQueue(err, null);

        clearAccessToken();
        window.location.href = "/auth/login";

        return Promise.reject(err);
    } finally {
        isRefreshing = false;
    }
});