import { useQuery } from "@tanstack/react-query"
import { getGenresAction } from "../actions/genre/genre.action"

export const useGenres = () => {
    return useQuery({
        queryKey: ['genres'],
        queryFn: getGenresAction,
    })
}

export const getGenres = useGenres