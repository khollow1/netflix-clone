import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../../components/Navbar";
import { getMovie } from "../../../lib/tmdb";

type Trailer = {
  type: string;
  site: string;
  key: string;
};

type Genre = {
  id: number;
  name: string;
};

type Movie = {
  id: number;
  title: string;
  overview?: string;
  release_date?: string;
  vote_average?: number;
  runtime?: number;
  backdrop_path?: string | null;
  poster_path?: string | null;
  genres?: Genre[];
  videos?: {
    results?: Trailer[];
  };
};

function getTmdbImage(path?: string | null, size: "w500" | "original" = "original") {
  if (!path) {
    return "/placeholder-poster.svg";
  }

  return `https://image.tmdb.org/t/p/${size}${path}`;
}

function formatRuntime(runtime?: number) {
  if (!runtime) {
    return "-";
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}h ${minutes.toString().padStart(2, "0")}`;
}

export default async function MoviePage(props: PageProps<"/movie/[id]">) {
  const params = await props.params;
  const movie = (await getMovie(params.id)) as Movie | null;

  if (!movie?.id) {
    notFound();
  }

  const trailer = movie.videos?.results?.find(
    (vid) => vid.type === "Trailer" && vid.site === "YouTube"
  );
  const safeTrailerKey =
    trailer && /^[A-Za-z0-9_-]{6,20}$/.test(trailer.key) ? trailer.key : null;

  return (
    <div className="min-h-screen text-white">
      <Navbar />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-white/10">
          <div className="absolute inset-0">
            <Image
              src={getTmdbImage(movie.backdrop_path, "original")}
              alt={movie.title}
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="relative bg-gradient-to-r from-black/90 via-black/75 to-black/35 p-6 sm:p-10">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-300">Fiche film</p>
            <h1 className="display-font text-3xl font-bold sm:text-5xl">{movie.title}</h1>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-200">
              <span className="rounded-full border border-white/20 px-3 py-1">
                ⭐ {movie.vote_average?.toFixed(1) ?? "-"}
              </span>
              <span className="rounded-full border border-white/20 px-3 py-1">
                {movie.release_date?.slice(0, 4) ?? "-"}
              </span>
              <span className="rounded-full border border-white/20 px-3 py-1">
                {formatRuntime(movie.runtime)}
              </span>
              {(movie.genres ?? []).slice(0, 3).map((genre) => (
                <span key={genre.id} className="rounded-full border border-white/20 px-3 py-1">
                  {genre.name}
                </span>
              ))}
            </div>
            <p className="mt-5 max-w-3xl text-sm text-slate-100 sm:text-base">
              {movie.overview || "Aucun résumé disponible pour ce film."}
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex rounded-xl bg-gradient-to-r from-[#ff4d4f] to-[#ff9a44] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Retour vers la page principale
              </Link>
            </div>
          </div>
        </section>

        {safeTrailerKey ? (
          <section className="section-shell overflow-hidden rounded-3xl p-4 sm:p-6">
            <h2 className="display-font mb-4 text-2xl font-semibold">Bande-annonce</h2>
            <div className="overflow-hidden rounded-2xl border border-white/15">
              <iframe
                className="aspect-video w-full"
                src={`https://www.youtube.com/embed/${safeTrailerKey}`}
                title={`Bande-annonce de ${movie.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}