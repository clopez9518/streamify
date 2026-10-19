interface LoadingProps {
    className?: string;
}

export const Loading = ({ className = "" }: LoadingProps) => {
    return (
        <div className={`dark flex min-h-screen w-full items-center justify-center bg-[#08090b] px-6 text-white ${className}`}>
            <div className="flex flex-col items-center gap-5">
                <div className="relative h-12 w-12">
                    <div className="absolute inset-0 rounded-full border border-white/10" />
                    <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-white" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium uppercase tracking-[0.24em] text-white/50">
                        Loading
                    </p>
                    <p className="mt-2 text-sm text-white/60">
                        Preparing your view...
                    </p>
                </div>
            </div>
        </div>
    )
}
