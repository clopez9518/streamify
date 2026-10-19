import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addToMyListAction, getMyListAction, removeFromMyListAction } from "../actions/user/user.action"
import { notify } from "@/lib/notify"


import { useAuthStore } from "@/store/auth.store"

export const useGetMyList = (profileId: string) => {
    const { status } = useAuthStore()
    return useQuery({
        queryKey: ['my-list', profileId],
        queryFn: () => getMyListAction(profileId),
        enabled: !!profileId && profileId !== 'undefined' && status === 'Authenticated',
        retry: 1
    })
}

export const useAddToMyList = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ profileId, movieId }: { profileId: string, movieId: string }) =>
            addToMyListAction(movieId, { profileId: profileId }),
        onSuccess: (movie, { profileId }) => {
            queryClient.invalidateQueries({ queryKey: ['movies'] })
            queryClient.invalidateQueries({ queryKey: ['my-list', profileId] })
            notify.success(`${movie.title} added to my list`)
        },
        onError: () => {
            notify.error("Failed to add to my list")
        }
    })
}

export const useRemoveFromMyList = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ profileId, movieId }: { profileId: string, movieId: string }) =>
            removeFromMyListAction(movieId, profileId),
        onSuccess: (movie, { profileId }) => {
            queryClient.invalidateQueries({ queryKey: ['movies'] })
            queryClient.invalidateQueries({ queryKey: ['my-list', profileId] })
            notify.success(`${movie.title} removed from my list`)
        },
        onError: () => {
            notify.error("Failed to remove from my list")
        }
    })
}