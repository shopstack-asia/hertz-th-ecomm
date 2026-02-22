import { HeroSection } from "@/components/home/HeroSection";
import { StickyBookingBar } from "@/components/booking/StickyBookingBar";
import { SpecialOffersSection } from "@/components/home/SpecialOffersSection";
import { CategorySection } from "@/components/home/CategorySection";
import { FuelTypeSection } from "@/components/home/FuelTypeSection";
import { TopLocationsSection } from "@/components/home/TopLocationsSection";
import { FeaturedVehicles } from "@/components/home/FeaturedVehicles";
import { WhyChooseSection } from "@/components/home/WhyChooseSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { AppDownloadSection } from "@/components/home/AppDownloadSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StickyBookingBar />
      <SpecialOffersSection />
      <CategorySection />
      <FuelTypeSection />
      <TopLocationsSection />
      <FeaturedVehicles />
      <WhyChooseSection />
      <TestimonialsSection />
      <AppDownloadSection />
    </>
  );
}
