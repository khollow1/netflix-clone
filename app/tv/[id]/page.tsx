import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../../components/Navbar";
import { getTVShow } from "../../../lib/tmdb";
import { getTvWatchLink } from "../../../lib/watch-links";

type Trailer = {
  type: string;
  site: string;
  key: string;
};

type Genre = {
  id: number;
  name: string;
};

type TVShow = {
  id: number;
  name: string;
  overview?: string;
  first_air_date?: string;
  vote_average?: number;
  number_of_seasons?: number;
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

export default async function TVPage(props: PageProps<"/tv/[id]">) {
  const params = await props.params;
  const show = (await getTVShow(params.id)) as TVShow | null;

  if (!show?.id) {
    notFound();
  }

  const trailer = show.videos?.results?.find(
    (vid) => vid.type === "Trailer" && vid.site === "YouTube"
  );
  const safeTrailerKey =
    trailer && /^[A-Za-z0-9_-]{6,20}$/.test(trailer.key) ? trailer.key : null;
  const watchLink = getTvWatchLink(show.id);

  return (
    <div className="min-h-screen text-white">
      <Navbar />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-white/10">
          <div className="absolute inset-0">
            <Image
              src={getTmdbImage(show.backdrop_path, "original")}
              alt={show.name}
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="relative bg-gradient-to-r from-black/90 via-black/75 to-black/35 p-6 sm:p-10">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-300">Fiche serie</p>
            <h1 className="display-font text-3xl font-bold sm:text-5xl">{show.name}</h1>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-200">
              <span className="rounded-full border border-white/20 px-3 py-1">
                ⭐ {show.vote_average?.toFixed(1) ?? "-"}
              </span>
              <span className="rounded-full border border-white/20 px-3 py-1">
                {show.first_air_date?.slice(0, 4) ?? "-"}
              </span>
              <span className="rounded-full border border-white/20 px-3 py-1">
                {show.number_of_seasons ?? "-"} saison(s)
              </span>
              {(show.genres ?? []).slice(0, 3).map((genre) => (
                <span key={genre.id} className="rounded-full border border-white/20 px-3 py-1">
                  {genre.name}
                </span>
              ))}
            </div>
            <p className="mt-5 max-w-3xl text-sm text-slate-100 sm:text-base">
              {show.overview || "Aucun resume disponible pour cette serie."}
            </p>
            <div className="mt-6">
              <div className="flex flex-wrap gap-3">
                {watchLink ? (
                  <a
                    href={watchLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-xl bg-gradient-to-r from-[#ff4d4f] to-[#ff9a44] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    Ou regarder
                  </a>
                ) : (
                  <span className="inline-flex rounded-xl border border-dashed border-white/25 bg-black/20 px-5 py-2.5 text-sm text-slate-300">
                    Lien non configure (ID serie: {show.id})
                  </span>
                )}
                <Link
                  href="/"
                  className="inline-flex rounded-xl border border-white/20 bg-black/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/45"
                >
                  Retour vers la page principale
                </Link>
              </div>
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
                title={`Bande-annonce de ${show.name}`}
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
