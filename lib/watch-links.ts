export const watchLinksByMovieId: Record<number, string> = {
  // Movie overrides
  875828: "https://www.streamex.net/watch/movie/875828?server=streamx",
};

export const watchLinksByTvId: Record<number, string> = {
  // TV overrides
  93544: "https://www.streamex.net/watch/tv/93544?server=streamx",
};

const MOVIE_BASE_URL = "https://www.streamex.net/watch/movie";
const TV_BASE_URL = "https://www.streamex.net/watch/tv";

// 🎬 Movies
export function getMovieWatchLink(movieId: number): string | null {
  if (!Number.isInteger(movieId) || movieId <= 0) {
    return null;
  }

  const customLink = watchLinksByMovieId[movieId];

  if (customLink) {
    return /^https?:\/\//i.test(customLink) ? customLink : null;
  }

  return `${MOVIE_BASE_URL}/${movieId}?server=streamx`;
}

// 📺 TV (show-level)
export function getTvWatchLink(tvId: number): string | null {
  if (!Number.isInteger(tvId) || tvId <= 0) {
    return null;
  }

  const customLink = watchLinksByTvId[tvId];

  if (customLink) {
    return /^https?:\/\//i.test(customLink) ? customLink : null;
  }

  return `${TV_BASE_URL}/${tvId}?server=streamx`;
}

// 📺 Episodes (recommended)
export function getTvEpisodeLink(
  tvId: number,
  season: number,
  episode: number
): string | null {
  if (
    !Number.isInteger(tvId) || tvId <= 0 ||
    !Number.isInteger(season) || season <= 0 ||
    !Number.isInteger(episode) || episode <= 0
  ) {
    return null;
  }

  return `${TV_BASE_URL}/${tvId}?season=${season}&episode=${episode}&server=streamx`;
}