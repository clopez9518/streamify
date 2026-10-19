import type { CreateProfileDto } from "@/interfaces/dto/profile.dto"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addProfileAction, deleteProfileAction, getProfilesAction } from "../actions/user/user.action"
import { notify } from "@/lib/notify"
import { errorMessagesMapper } from "@/mappers/error.mapper"
import type { ApiError } from "@/interfaces/error/apiError.interface"
import { validationErrorsMapper } from "@/helpers/error.helper"

export const useAddProfile = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (profile: CreateProfileDto) => addProfileAction(profile),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profiles"] })
            notify.success("Profile added successfully")
        },
        onError: (error: ApiError) => {
            if (error.errors && Object.keys(error.errors).length > 0) {
                const validationErrors = validationErrorsMapper(error.errors)
                notify.error(validationErrors.join(', '))
                return
            }
            notify.error(errorMessagesMapper[error.code] || error.detail)
        }
    })
}

export const useDeleteProfile = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => deleteProfileAction(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profiles"] })
            notify.success("Profile deleted successfully")
        },
        onError: (error: ApiError) => {
            if (error.errors && Object.keys(error.errors).length > 0) {
                const validationErrors = validationErrorsMapper(error.errors)
                notify.error(validationErrors.join(', '))
                return
            }
            notify.error(errorMessagesMapper[error.code] || error.detail)
        }
    })
}

export const useGetProfiles = () => {
    return useQuery({
        queryKey: ["profiles"],
        queryFn: () => getProfilesAction(),
    })
}