import { SearchX } from "lucide-react"

export const NotFound = ({ title }: { title: string }) => {
    return (
        <div className="dark flex min-h-[70vh] items-center justify-center bg-[#08090b] px-6 text-white">
            <div className="w-full max-w-md rounded-md border border-white/10 bg-white/5 p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.32)]">
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white/80">
                    <SearchX className="h-6 w-6" />
                </div>
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-white/50">
                    No results
                </p>
                <h1 className="text-2xl font-semibold tracking-normal text-white">
                    {title}
                </h1>
                <p className="mt-3 text-sm leading-6 text-white/60">
                    Try browsing another section or come back later.
                </p>
            </div>
        </div>
    )
}
