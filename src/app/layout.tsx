import type { Metadata } from "next";
import { Bai_Jamjuree } from "next/font/google";
import { StoreProvider } from "@/redux/StoreProvider";
import "./globals.css";
import { LayoutWrapper } from "@/components/home/LayoutWrapper";
import ToasterProvider from "@/components/ToasterProvider";

const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin", "latin-ext", "thai"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bai-jamjuree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rajseba - Expert Care for Your Premium Home",
  description:
    "Professional home services in Bangladesh with verified experts.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${baiJamjuree.variable} antialiased`}>
      <body className={`min-h-screen flex flex-col bg-slate-50 ${baiJamjuree.className} antialiased`}>
        <StoreProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </StoreProvider>
        <ToasterProvider />
      </body>
    </html>
  );
}
