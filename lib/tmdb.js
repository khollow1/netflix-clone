const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

async function tmdbFetch(path, { revalidate = 900 } = {}) {
  if (!API_KEY) {
    return null;
  }

  const separator = path.includes("?") ? "&" : "?";
  const url = `${BASE_URL}${path}${separator}api_key=${API_KEY}&language=fr-FR`;
  const res = await fetch(url, {
    next: { revalidate },
  });

  if (!res.ok) {
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