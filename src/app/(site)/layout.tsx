import { AuthProvider } from "@/contexts/auth_context";
import { BookingProvider } from "@/contexts/BookingContext";
import { PromotionBarWrapper } from "@/components/promotion/PromotionBarWrapper";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <BookingProvider>
        <div className="flex min-h-screen flex-col bg-white">
          <Header />
          <PromotionBarWrapper>
            <main className="flex-1">{children}</main>
          </PromotionBarWrapper>
          <Footer />
        </div>
      </BookingProvider>
    </AuthProvider>
  );
}
