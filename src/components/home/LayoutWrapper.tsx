"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import Footer from "./Footer";
import { AiChatBot } from "./AiChatBot";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const cleanPath = pathname?.replace(/\/$/, "") || "";

  // Hide the global home page navbar and footer on dashboard and auth pages only
  const isDashboard = cleanPath.startsWith("/dashbord");
  const isAuth = cleanPath === "/login" || cleanPath === "/signup";
  const hideLayout = isDashboard || isAuth;

  return (
    <>
      {!hideLayout && <Navbar />}
      <main
        className={`grow ${hideLayout ? "" : "md:pb-0 pb-[calc(env(safe-area-inset-bottom)+80px)]"}`}
      >
        {children}
      </main>
      {!hideLayout && <Footer />}
      {!hideLayout && <AiChatBot />}
    </>
  );
}