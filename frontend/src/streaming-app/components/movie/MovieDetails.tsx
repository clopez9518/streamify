import type { Movie } from "@/interfaces";
import { ContentRow } from "../shared";

interface Props {
    movie: Movie;
    similarContent: Movie[];
}


export const MovieDetails = ({ movie, similarContent }: Props) => {
    return (
        <div className="relative z-10 -mt-20 px-6 lg:px-12 pb-20">
            <div className="max-w-5xl">
                {/* Match & Metadata */}
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-green-500 text-lg" style={{ fontWeight: 600 }}>
                        {movie.rating}
                    </span>
                    <div className="flex items-center gap-3 text-gray-300">
                        <span className="px-2 py-0.5 border border-gray-500 text-gray-400 text-xs">HD</span>
                    </div>
                </div>


                {/* Additional Details */}
                <div className="space-y-3 text-sm mt-20">
                    <div className="flex gap-2">
                        <span className="text-gray-500 min-w-[100px]">Genres:</span>
                        {movie.genres.map((genre, index) => (
                            <div key={index}>
                                <span className="text-white">{genre.name}</span>
                                {index !== movie.genres.length - 1 && <span className="text-white"> - </span>}
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <span className="text-gray-500 min-w-[100px]">Crew:</span>
                        <span className="text-white">{movie.crew.join(', ')}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-gray-500 min-w-[100px]">Cast:</span>
                        <span className="text-white">{movie.cast.join(', ')}</span>
                    </div>
                </div>
            </div>

            {/* Similar Content */}
            {
                similarContent.length > 0 && (
                    <div className="-mx-6 lg:-mx-12 mt-12">
                        <ContentRow title="More Like This" items={similarContent} />
                    </div>
                )
            }
        </div>
    )
}
