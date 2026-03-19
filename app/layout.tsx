import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reeshaw — The First Linear Prediction Market",
  description:
    "The first prediction market that prices magnitude, not just direction. Trade the actual outcome, not just whether it happens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={inter.variable}
        style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
