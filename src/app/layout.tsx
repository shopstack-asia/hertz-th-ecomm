import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import { InstallPromptBanner } from "@/components/pwa/InstallPromptBanner";

const ibmThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-ibm-plex-sans-thai",
});

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
    <html lang="en" className={ibmThai.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${ibmThai.className} min-h-screen`}>
        {children}
        <InstallPromptBanner />
      </body>
    </html>
  );
}
