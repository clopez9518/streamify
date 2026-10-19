import { Loading, NotFound, Error } from "@/streaming-app/components/shared";
import { ContentRow } from "../../components/shared/ContentRow"
import { Hero } from "../../components/shared/Hero"
import { useHome } from "../../hooks/useHome";
import { useProfileStore } from "@/store/profile.store";

export const HomePage = () => {

  const { activeProfile } = useProfileStore();
  const {
    heroMovie,
    trendingMovies,
    topRatedMovies,
    newReleasesMovies,
    myListMovies,
    recentlyAddedMovies,
    isLoading,
    error } = useHome(activeProfile?.id.toString() ?? '');

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <Error title="Error fetching movies" />
  }

  if (trendingMovies?.length === 0 || !trendingMovies) {
    return <NotFound title="No movies found" />
  }

  return (
    <div className="dark min-h-screen overflow-hidden bg-[#08090b] text-white">
      <Hero movie={heroMovie || trendingMovies[0]} />

      <div className="relative z-10 -mt-28 pb-24">
        <div className="pointer-events-none absolute inset-x-0 -top-28 h-44 bg-linear-to-b from-transparent via-[#08090b]/80 to-[#08090b]" />

        <section className="relative space-y-12">
          <ContentRow title="Trending Now" items={trendingMovies || []} />
          <ContentRow title="Recently Added" items={recentlyAddedMovies || []} />
          <ContentRow title="Top Rated" items={topRatedMovies || []} />
          <ContentRow title="New Releases" items={newReleasesMovies || []} />

          {
            myListMovies && myListMovies.length > 0 && <ContentRow title="My List" items={myListMovies || []} />
          }
        </section>
      </div>
    </div>
  )
}
