import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import {
  getByGenre,
  getTrending,
  getTrendingAnime,
  getTrendingTV,
  getTVByGenre,
  searchMoviesAndTV,
} from "../lib/tmdb";

type TMDBItem = {
  id: number;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type?: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  overview?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
};

type CardItem = {
  id: number;
  poster_path: string | null;
  title: string;
  vote_average?: number;
  release_date?: string;
  href: string;
};

function getTmdbImage(path: string | null, size: "w500" | "original" = "w500") {
  if (!path) {
    return "/placeholder-poster.svg";
  }

  return `https://image.tmdb.org/t/p/${size}${path}`;
}

function formatYear(date?: string) {
  if (!date) {
    return "-";
  }
  return new Date(date).getFullYear().toString();
}

function toCardItems(items: TMDBItem[] | undefined, routePrefix: "/movie" | "/tv"): CardItem[] {
  return (items ?? []).map((item) => ({
    id: item.id,
    poster_path: item.poster_path,
    title: item.title ?? item.name ?? "Titre indisponible",
    vote_average: item.vote_average,
    release_date: item.release_date ?? item.first_air_date,
    href: `${routePrefix}/${item.id}`,
  }));
}

function toSearchCardItems(items: TMDBItem[] | undefined): CardItem[] {
  return (items ?? [])
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map((item) => {
      const routePrefix = item.media_type === "tv" ? "/tv" : "/movie";

      return {
        id: item.id,
        poster_path: item.poster_path,
        title: item.title ?? item.name ?? "Titre indisponible",
        vote_average: item.vote_average,
        release_date: item.release_date ?? item.first_air_date,
        href: `${routePrefix}/${item.id}`,
      };
    });
}

export default async function Home(props: PageProps<"/">) {
  const searchParams = await props.searchParams;
  const query = typeof searchParams.q === "string" ? searchParams.q.trim() : "";
  const tmdbConfigured = Boolean(
    process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_API_KEY || process.env.TMDB_READ_ACCESS_TOKEN,
  );

  const [trendingMovies, trendingTV, anime, actionMovies, comedyMovies, dramaTV, searchResults] = await Promise.all([
    getTrending(),
    getTrendingTV(),
    getTrendingAnime(),
    getByGenre(28),
    getByGenre(35),
    getTVByGenre(18),
    query ? searchMoviesAndTV(query) : Promise.resolve({ results: [] }),
  ]);

  const heroMovie: TMDBItem | undefined = trendingMovies.results?.[0];
  const searchedMovies = toSearchCardItems(searchResults.results);
  const trendingMovieCards = toCardItems(trendingMovies.results, "/movie");
  const trendingTVCards = toCardItems(trendingTV.results, "/tv");
  const animeCards = toCardItems(anime.results, "/tv");
  const actionMovieCards = toCardItems(actionMovies.results, "/movie");
  const comedyMovieCards = toCardItems(comedyMovies.results, "/movie");
  const dramaTVCards = toCardItems(dramaTV.results, "/tv");

  return (
    <div className="min-h-screen text-white">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        {!tmdbConfigured ? (
          <section className="rounded-2xl border border-amber-300/40 bg-amber-500/10 p-4 text-amber-100">
            <p className="text-sm font-medium">
              TMDB n&apos;est pas configure sur cet environnement. Ajoute la variable `TMDB_API_KEY` (ou
              `TMDB_READ_ACCESS_TOKEN`) dans Vercel puis redeploie.
            </p>
          </section>
        ) : null}

        <section className="relative overflow-hidden rounded-3xl border border-white/10">
          <div className="absolute inset-0">
            <Image
              src={getTmdbImage(heroMovie?.backdrop_path ?? null, "original")}
              alt={heroMovie?.title ?? "Film tendance"}
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="relative bg-gradient-to-r from-black/90 via-black/65 to-black/35 p-6 sm:p-10 lg:p-14">
            <p className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
              En vedette
            </p>
            <h1 className="display-font max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">
              {heroMovie?.title ?? "Bienvenue sur CineVerse"}
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-slate-200 sm:text-base">
              {heroMovie?.overview?.slice(0, 220) ||
                "Ton hub cinéma premium pour explorer les tendances, les genres et les bandes-annonces en quelques clics."}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {heroMovie && (
                <Link
                  href={`/movie/${heroMovie.id}`}
                  className="rounded-xl bg-gradient-to-r from-[#ff4d4f] to-[#ff9a44] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  Voir le film
                </Link>
              )}
              <span className="rounded-xl border border-white/20 bg-black/35 px-4 py-2 text-sm text-slate-200">
                Top de la semaine
              </span>
            </div>
          </div>
        </section>

        {query ? (
          <ContentRow
            title={`Résultats pour "${query}"`}
            subtitle={`${searchedMovies.length} resultat(s) trouve(s)`}
            movies={searchedMovies}
          />
        ) : null}

        <ContentRow
          title="Films tendances"
          subtitle="Les films dont tout le monde parle"
          movies={trendingMovieCards}
        />
        <ContentRow
          title="Series tendances"
          subtitle="Les series les plus populaires du moment"
          movies={trendingTVCards}
        />
        <ContentRow
          title="Anime tendances"
          subtitle="Selection anime (TV d'origine japonaise)"
          movies={animeCards}
        />
        <ContentRow title="Action" subtitle="Adrenaline pure" movies={actionMovieCards} />
        <ContentRow title="Comedie" subtitle="Pour passer une bonne soiree" movies={comedyMovieCards} />
        <ContentRow title="Dramas TV" subtitle="Series dramatiques a suivre" movies={dramaTVCards} />
      </main>
    </div>
  );
}

function ContentRow({
  title,
  subtitle,
  movies,
}: {
  title: string;
  subtitle: string;
  movies: CardItem[];
}) {
  if (!movies?.length) {
    return (
      <section className="section-shell rounded-3xl p-6">
        <h2 className="display-font text-2xl font-semibold text-white">{title}</h2>
        <p className="mt-2 text-sm text-slate-300">Aucun film disponible pour le moment.</p>
      </section>
    );
  }

  return (
    <section className="section-shell rounded-3xl p-5 sm:p-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="display-font text-2xl font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={movie.href}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70"
          >
            <div className="relative aspect-[2/3]">
              <Image
                src={getTmdbImage(movie.poster_path)}
                alt={movie.title}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 30vw, 20vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-3">
              <h3 className="line-clamp-1 text-sm font-semibold text-white">{movie.title}</h3>
              <p className="mt-1 text-xs text-slate-300">
                {formatYear(movie.release_date)} • ⭐ {movie.vote_average?.toFixed(1) ?? "-"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}