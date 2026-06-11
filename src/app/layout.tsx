import type { Metadata } from "next";
<<<<<<< HEAD
import { Bai_Jamjuree } from "next/font/google";
import "./globals.css";

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
=======
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rajseba - Home Services in Bangladesh",
  description:
    "Premium, reliable, and effortless home service solutions for your urban lifestyle in Bangladesh.",
>>>>>>> origin/shohan
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
<<<<<<< HEAD
      className={`${baiJamjuree.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-slate-50 font-sans">
        {children}
      </body>
    </html>
  );
}
=======
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
>>>>>>> origin/shohan
