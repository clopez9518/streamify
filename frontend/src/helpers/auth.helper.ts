import { useAuthStore } from "@/store/auth.store";

export const getAccessToken = () => useAuthStore.getState().token;
export const setAccessToken = (token: string) => useAuthStore.getState().setToken(token);
export const clearAccessToken = () => useAuthStore.getState().clearToken();
export const getAuthStatus = () => useAuthStore.getState().status;
export const refreshToken = () => useAuthStore.getState().refreshToken();
