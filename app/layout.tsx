import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { StoreHydration } from "@/components/shared/StoreHydration";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SpeedRead - RSVP Speed Reading",
  description: "A minimalist speed reading app using RSVP (Rapid Serial Visual Presentation)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <StoreHydration>{children}</StoreHydration>
        </ThemeProvider>
      </body>
    </html>
  );
}

