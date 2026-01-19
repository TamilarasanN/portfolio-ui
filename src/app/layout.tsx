import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Background } from "@/component/atoms/Background";
import { DigitalRain } from "@/component/atoms/DigitalRain";

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
      { url: "/parzival-avatar.jpeg", type: "image/jpeg" },
      { url: "/parzival-avatar.jpeg", sizes: "32x32", type: "image/jpeg" },
      { url: "/parzival-avatar.jpeg", sizes: "16x16", type: "image/jpeg" },
    ],
    apple: "/parzival-avatar.jpeg",
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
        {children}
      </body>
    </html>
  );
}
