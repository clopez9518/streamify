import { DataTable } from "@/admin/components/DataTable";
import { AddProfileDialog } from "@/streaming-app/components/profile/AddProfileDialog";
import { columns } from "@/streaming-app/components/profile/ProfileColumns";
import { Error, Loading } from "@/streaming-app/components/shared";
import { useGetProfiles } from "@/streaming-app/hooks/useUsers";



export const ProfilePage = () => {
    const { data, isLoading, error } = useGetProfiles();

    const inputFilter = {
        placeholder: 'Filter profiles by name...',
        column: 'name',
    }

    if (isLoading) return <Loading />
    if (error) return <Error title={error.message} />

    return (
        <div className="mb-6 px-6 lg:px-12 w-full text-white">
            <h1 className="text-2xl font-bold text-white">Profiles</h1>
            <p className="text-gray-400">Manage your profiles</p>

            <div className="mt-4 flex w-full mb-4 justify-end">
                <AddProfileDialog />
            </div>

            <DataTable
                columns={columns}
                data={data || []}
                inputFilter={inputFilter}
            />

        </div>
    );

}
