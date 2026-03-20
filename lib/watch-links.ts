export const watchLinksByMovieId: Record<number, string> = {
  // Custom overrides (only if needed)
  875828: "https://www.streamex.net/watch/movie/875828?server=streamx",
};

const BASE_URL = "https://www.streamex.net/watch/movie";

export function getWatchLink(movieId: number): string | null {
  if (!movieId || typeof movieId !== "number") {
    return null;
  }

  // 1. Use custom link if it exists
  const customLink = watchLinksByMovieId[movieId];
  if (customLink) {
    if (/^https?:\/\//i.test(customLink)) {
      return customLink;
    }
    return null;
  }

  // 2. Otherwise generate dynamically
  const generatedLink = `${BASE_URL}/${movieId}?server=streamx`;

  return generatedLink;
}