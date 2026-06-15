"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import Footer from "./Footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const cleanPath = pathname?.replace(/\/$/, "") || "";

  // Hide the global home page navbar and footer on dashboard pages
  const isDashboard = cleanPath.startsWith("/dashbord");
  const hideLayout = isDashboard;

  return (
    <>
      {!hideLayout && <Navbar />}
      <main
        className={`flex-grow ${hideLayout ? "" : "pb-20 md:pb-0 pb-[calc(env(safe-area-inset-bottom)+80px)]"}`}
      >
        {children}
      </main>
      {!hideLayout && <Footer />}
    </>
  );
}
// wessdssss