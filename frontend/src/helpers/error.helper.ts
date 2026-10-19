import type { ApiError } from "@/interfaces/error/apiError.interface"
import { errorMessagesMapper } from "@/mappers/error.mapper"
import axios from "axios"

export const handleApiError = (error: unknown): ApiError => {
    if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError

        return {
            title: apiError?.title || "Error desconocido",
            status: apiError?.status || error.response?.status || 500,
            detail: apiError?.detail || "Error desconocido",
            instance: apiError?.instance || "",
            type: apiError?.type || "",
            code: apiError?.code || "",
            errors: apiError?.errors || {},
        }
    }

    return {
        title: "Error desconocido",
        status: 500,
        detail: "Error inesperado",
        instance: "",
        type: "",
        code: "UNEXPECTED_ERROR",
        errors: {},
    }
}


export const validationErrorsMapper = (errors: Record<string, string[]>): string[] => {
    const validationErrors: string[] = [];

    Object.values(errors).forEach((messages) => {
        validationErrors.push(errorMessagesMapper[messages[0]] || messages[0])
    })

    return validationErrors
}