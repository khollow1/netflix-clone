"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const defaultQuery = useMemo(
    () => searchParams.get("q") ?? "",
    [searchParams]
  );

  const isHome = pathname === "/";

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 glass">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="display-font text-2xl font-bold tracking-tight text-white">
          <span className="bg-gradient-to-r from-[#ff4d4f] to-[#ff9a44] bg-clip-text text-transparent">
            CineVerse
          </span>
        </Link>

        <div className="hidden text-sm text-slate-300 md:block">
          {isHome ? "Découvre les films du moment" : "Détails et bande-annonce"}
        </div>

        <form action="/" className="flex w-full max-w-md items-center gap-2 sm:w-auto">
          <input
            type="search"
            name="q"
            defaultValue={defaultQuery}
            placeholder="Rechercher un film..."
            className="h-10 w-full rounded-xl border border-white/15 bg-slate-950/80 px-3 text-sm text-white placeholder:text-slate-400"
            aria-label="Rechercher un film"
          />
          <button
            type="submit"
            className="h-10 rounded-xl bg-gradient-to-r from-[#ff4d4f] to-[#ff9a44] px-4 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Rechercher
          </button>
        </form>
      </div>
    </nav>
  );
}