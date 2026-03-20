// Keep secrets server-side. Fallbacks are kept for existing setups.
const API_KEY = process.env.TMDB_API_KEY ?? process.env.NEXT_PUBLIC_API_KEY;
const ACCESS_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

async function tmdbFetch(path, { revalidate = 900 } = {}) {
  if (!API_KEY && !ACCESS_TOKEN) {
    console.error("[tmdb] Missing credentials. Set TMDB_API_KEY or TMDB_READ_ACCESS_TOKEN.");
    return null;
  }

  const separator = path.includes("?") ? "&" : "?";
  const authQuery = ACCESS_TOKEN ? "" : `${separator}api_key=${API_KEY}`;
  const langQuery = path.includes("language=") ? "" : `${path.includes("?") || authQuery ? "&" : "?"}language=fr-FR`;
  const url = `${BASE_URL}${path}${authQuery}${langQuery}`;

  const headers = ACCESS_TOKEN
    ? {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      }
    : undefined;

  const res = await fetch(url, {
    next: { revalidate },
    // Avoid forwarding ambient credentials/cookies to third-party APIs.
    credentials: "omit",
    headers,
  });

  if (!res.ok) {
    const details = await res.text().catch(() => "");
    console.error(`[tmdb] ${res.status} ${res.statusText} for ${path} ${details.slice(0, 240)}`);
    return null;
  }

  return res.json();
}

export async function getTrending() {
  return (await tmdbFetch("/trending/movie/week")) ?? { results: [] };
}

export async function getByGenre(genreId) {
  return (
    (await tmdbFetch(`/discover/movie?with_genres=${genreId}&sort_by=popularity.desc`)) ??
    { results: [] }
  );
}

export async function searchMovies(query) {
  if (!query?.trim()) {
    return { results: [] };
  }

  return (
    (await tmdbFetch(`/search/movie?query=${encodeURIComponent(query.trim())}`, {
      revalidate: 120,
    })) ?? { results: [] }
  );
}

export async function getMovie(id) {
  return (
    (await tmdbFetch(`/movie/${id}?append_to_response=videos,credits,images`, {
      revalidate: 1800,
    })) ?? null
  );
}