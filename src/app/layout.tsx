import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Background } from "@/component/atoms/Background";
import { DigitalRain } from "@/component/atoms/DigitalRain";
import { FirebaseAnalytics } from "@/component/atoms/FirebaseAnalytics";
import { ConsoleWelcome } from "@/component/atoms/ConsoleWelcome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Personal portfolio website",
  icons: {
    icon: [
      { url: "/parzival-avatar.jpeg", sizes: "any" },
      { url: "/parzival-avatar.jpeg", sizes: "32x32", type: "image/jpeg" },
      { url: "/parzival-avatar.jpeg", sizes: "16x16", type: "image/jpeg" },
    ],
    apple: [
      { url: "/parzival-avatar.jpeg", sizes: "180x180", type: "image/jpeg" },
    ],
    shortcut: "/parzival-avatar.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Background />
        <DigitalRain />
        <ConsoleWelcome />
        <Suspense fallback={null}>
          <FirebaseAnalytics />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
