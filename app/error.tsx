"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 text-white">
      <div className="glass max-w-lg rounded-2xl p-6 text-center">
        <h2 className="display-font text-2xl font-semibold">Oups, une erreur est survenue</h2>
        <p className="mt-3 text-sm text-slate-300">{error.message || "Impossible de charger la page."}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 rounded-xl bg-gradient-to-r from-[#ff4d4f] to-[#ff9a44] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
