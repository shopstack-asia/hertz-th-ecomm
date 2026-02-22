import type { Metadata, Viewport } from "next";
import "./globals.css";
import { InstallPromptBanner } from "@/components/pwa/InstallPromptBanner";

export const metadata: Metadata = {
  title: "Hertz Thailand | Car Rental",
  description: "Rent a car in Thailand with Hertz",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hertz TH",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFCC00",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <InstallPromptBanner />
      </body>
    </html>
  );
}
