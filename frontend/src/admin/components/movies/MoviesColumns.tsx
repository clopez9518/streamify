import type { ColumnDef } from "@tanstack/react-table"
import type { MovieAdmin } from "@/interfaces/entities/movie.interface"
import { ArrowUpDown } from "lucide-react"
import { Link } from "react-router"
import { MovieActionsCell } from "./MovieActionCell"

export const columns: ColumnDef<MovieAdmin>[] = [
    {
        accessorKey: "thumbnailUrl",
        header: "",
        cell: ({ row }) => (
            <img
                src={row.original.thumbnailUrl}
                className="w-12 h-16 object-cover rounded"
            />
        ),
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "releaseYear",
        header: "Year",
    },
    {
        accessorKey: "durationMinutes",
        header: "Duration",
        cell: ({ row }) => `${row.original.durationMinutes} min`,
    },
    {
        accessorKey: "rating",
        header: ({ column }) => {
            return (
                <div
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex items-center gap-2 cursor-pointer select-none"
                >
                    Rating
                    <ArrowUpDown className="h-4 w-4" />
                </div>
            )
        },
        cell: ({ row }) => `⭐ ${row.original.rating}`,
    },
    {
        accessorKey: "genres",
        header: "Genres",
        cell: ({ row }) =>
            row.original.genres.map((g) => g.name).join(", "),
    },
    // {
    //     accessorKey: "isTrending",
    //     header: ({ column }) => {
    //         return (
    //             <div
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //                 className="flex items-center gap-2 cursor-pointer select-none"
    //             >
    //                 Trending
    //                 <ArrowUpDown className="h-4 w-4" />
    //             </div>
    //         )
    //     },
    //     cell: ({ row }) =>
    //         row.original.isTrending ? "🔥 Sí" : "—",
    // },
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
        cell: ({ row }) => {
            const movie = row.original

            return (
                <div className="flex gap-2">
                    <Link to={`/admin/movies/${movie.id}/edit`}>
                        <span
                            className="inline-flex h-9 items-center justify-center rounded-md border border-white/10 bg-white/5 px-3 text-sm font-medium text-white/70 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                        >
                            Edit
                        </span>
                    </Link>

                    <MovieActionsCell movie={movie} />
                </div>
            )
        },
    },]
