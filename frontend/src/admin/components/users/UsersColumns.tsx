import type { ColumnDef } from "@tanstack/react-table"
import type { UserAdminDto } from "@/interfaces/dto/user.dto"
import { ArrowUpDown } from "lucide-react"
import { UserActionsCell } from "./UserActionCell"


export const columns: ColumnDef<UserAdminDto>[] = [
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
    },
    {
        accessorKey: "lastLoginAt",
        header: "Last Login",
        cell: ({ row }) => {
            if (!row.original.lastLoginAt) return '-';
            const date = new Date(row.original.lastLoginAt);
            return date.toLocaleDateString();
        }
    },
    {
        accessorKey: "isActive",
        header: ({ column }) => {
            return (
                <div
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex items-center gap-2 cursor-pointer select-none"
                >
                    Status
                    <ArrowUpDown className="h-4 w-4" />
                </div>
            )
        },
        cell: ({ row }) =>
            row.original.isActive ? (
                <span className="text-green-500">Activo</span>
            ) : (
                <span className="text-red-500">Inactivo</span>
            ),
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => {
            return (
                <div
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex items-center gap-2 cursor-pointer select-none"
                >
                    Created At
                    <ArrowUpDown className="h-4 w-4" />
                </div>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt);
            return date.toLocaleDateString();
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <UserActionsCell user={row.original} />
    },]
