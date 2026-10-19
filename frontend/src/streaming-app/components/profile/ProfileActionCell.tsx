import { Button } from "@/components/ui/button"
import type { ProfileDto } from "@/interfaces/dto/profile.dto"
import { useDeleteProfile } from "@/streaming-app/hooks/useUsers"


export const ProfileActionsCell = ({ profile }: { profile: ProfileDto }) => {
    const mutation = useDeleteProfile()

    return (
        <div className="flex gap-2">
            <Button
                className="cursor-pointer bg-red-500 hover:bg-red-600"
                onClick={() => mutation.mutate(profile.id.toString())}
                disabled={mutation.isPending}
            >
                Delete
            </Button>
        </div>
    )
}