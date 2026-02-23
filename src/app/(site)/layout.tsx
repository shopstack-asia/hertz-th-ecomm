import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/auth_context";
import { BookingProvider } from "@/contexts/BookingContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BookingProvider>
          <div className="flex min-h-screen flex-col bg-white">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </BookingProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
