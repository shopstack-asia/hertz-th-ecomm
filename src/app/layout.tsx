import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hertz Thailand | Car Rental",
  description: "Rent a car in Thailand with Hertz",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
