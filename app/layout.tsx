import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "@/lib/context/app-state";
import { LanguageProvider } from "@/lib/i18n";
import EmergencyButton from "@/components/EmergencyButton";
import TopBar from "@/components/TopBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "First 72 — After You Go Home",
  description: "Caregiver support for the first 72 hours after hospital discharge.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        <AppStateProvider>
          <LanguageProvider>
            <TopBar />
            {children}
            <EmergencyButton />
          </LanguageProvider>
        </AppStateProvider>
      </body>
    </html>
  );
}
