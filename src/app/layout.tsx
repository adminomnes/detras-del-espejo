import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/utils/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Podcast`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    images: [
      {
        url: "/logo.png",
        width: 400,
        height: 400,
      },
    ],
    locale: "es_CL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-black text-white relative">
        {children}
      </body>
    </html>
  );
}
