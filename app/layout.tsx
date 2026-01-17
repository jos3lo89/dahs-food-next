import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dahsjhoss.store"),
  title: {
    default: "Dahs Jhoss | Desayunos y Delivery en Andahuaylas",
    template: "%s | Dahs Jhoss",
  },
  description:
    "Desayunos, postres y delivery en Andahuaylas. Pide online y recibe rápido con atención personalizada.",
  openGraph: {
    title: "Dahs Jhoss | Desayunos y Delivery en Andahuaylas",
    description:
      "Desayunos, postres y delivery en Andahuaylas. Pide online y recibe rápido con atención personalizada.",
    url: "https://www.dahsjhoss.store",
    siteName: "Dahs Jhoss",
    locale: "es_PE",
    type: "website",
    images: [
      {
        url: "/images/seo/og_image_1200x630.webp",
        width: 1200,
        height: 630,
        alt: "Dahs Jhoss - Desayunos y Delivery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dahs Jhoss | Desayunos y Delivery en Andahuaylas",
    description:
      "Desayunos, postres y delivery en Andahuaylas. Pide online y recibe rápido con atención personalizada.",
    images: ["/images/seo/twitter_image_1200x630.webp"],
  },
  icons: {
    icon: "/desayuno.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
