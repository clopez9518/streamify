import type { ColumnDef } from "@tanstack/react-table";
import type { ProfileDto } from "@/interfaces/dto/profile.dto";
import { ProfileActionsCell } from "./ProfileActionCell";


export const columns: ColumnDef<ProfileDto>[] = [
    {
        accessorKey: "avatarUrl",
        header: "Avatar",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                        <span className="text-white">{row.original.name.charAt(0)}</span>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "isKids",
        header: "Is Kids",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2">
                    <span className="text-white">{row.original.isKids ? "Yes" : "No"}</span>
                </div>
            )
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            return (
                <ProfileActionsCell profile={row.original} />
            )
        }
    },]