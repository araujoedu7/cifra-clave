import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RegisterSW } from "./registerSW";
import ThemeToggle from "src/components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cifra Clave",
  description: "App de cifras pro grupo",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RegisterSW />

        <header className="fixed top-0 left-0 right-0 bg-neutral-light dark:bg-neutral-dark border-b border-gray-200 dark:border-gray-700 z-10 shadow-soft">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-primary">
                Cifra Clave
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Grupo Católico
              </span>
            </div>

            <ThemeToggle />
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}