"use client";

import { usePathname } from "next/navigation";
import { AnimeBackground } from "@/components/AnimeBackground";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <main className="relative z-10 flex-1">{children}</main>;
  }

  return (
    <>
      <AnimeBackground />
      <Header />
      <main className="relative z-10 flex-1 pt-16">{children}</main>
      <Footer />
    </>
  );
}
