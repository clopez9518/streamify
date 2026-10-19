import { streamingApi } from "@/api/streaming.api"
import { handleApiError } from "@/helpers/error.helper"
import type { MovieDto } from "@/interfaces/dto/movie.dto"
import { type AddToMyListDto, type CreateProfileDto, type ProfileDto } from "@/interfaces/dto/profile.dto"

export const addProfileAction = async (profile: CreateProfileDto) => {
    try {
        const { data } = await streamingApi.post<ProfileDto>("/profiles", profile)
        return data
    } catch (error: unknown) {
        throw handleApiError(error)
    }
}

export const getProfilesAction = async () => {
    try {
        const { data } = await streamingApi.get<ProfileDto[]>("/profiles")
        return data
    } catch (error: unknown) {
        throw handleApiError(error)
    }
}

export const addToMyListAction = async (movieId: string, addToMyListDto: AddToMyListDto): Promise<MovieDto> => {
    try {
        const { data } = await streamingApi.post<MovieDto>(`/profiles/mylist/${movieId}`, addToMyListDto)
        return data
    } catch (error: unknown) {
        throw handleApiError(error)
    }
}

export const removeFromMyListAction = async (movieId: string, profileId: string): Promise<MovieDto> => {
    try {
        const { data } = await streamingApi.delete<MovieDto>(`/profiles/mylist/${movieId}`, { data: { profileId } })
        return data
    } catch (error: unknown) {
        throw handleApiError(error)
    }
}

export const getMyListAction = async (profileId: string): Promise<MovieDto[]> => {
    try {
        const { data } = await streamingApi.get<MovieDto[]>(`/profiles/mylist/${profileId}`)
        return data
    } catch (error: unknown) {
        throw handleApiError(error)
    }
}

export const deleteProfileAction = async (id: string): Promise<void> => {
    try {
        await streamingApi.delete(`/profiles/${id}`)
    } catch (error: unknown) {
        throw handleApiError(error)
    }
}

