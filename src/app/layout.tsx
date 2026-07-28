import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { AIChatbot } from "@/components/AIChatbot";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Handiboost - Le sport pour tous",
  description: "Plateforme centralisée pour l'Activité Physique Adaptée (APA).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} font-sans h-full antialiased scroll-smooth scroll-pt-28`}
    >
      <body className="min-h-full flex flex-col text-base leading-relaxed transition-colors duration-300">
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
          <AIChatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
