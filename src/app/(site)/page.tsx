import { HeroSection } from "@/components/home/HeroSection";
import { getWebsiteConfig } from "@/lib/cms/site-config";
import { resolveHomeHeroCarousel } from "@/lib/cms/websiteHomeHeroCarousel";
import { StickyBookingBar } from "@/components/booking/StickyBookingBar";
import { SpecialOffersSection } from "@/components/home/SpecialOffersSection";
import { CategorySection } from "@/components/home/CategorySection";
import { FuelTypeSection } from "@/components/home/FuelTypeSection";
import { TopLocationsSection } from "@/components/home/TopLocationsSection";
import { GiftVouchersSection } from "@/components/home/GiftVouchersSection";
import { FeaturedVehicles } from "@/components/home/FeaturedVehicles";
import { WhyChooseSection } from "@/components/home/WhyChooseSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { AppDownloadSection } from "@/components/home/AppDownloadSection";

export default async function HomePage() {
  const site = await getWebsiteConfig();
  const heroCarousel = resolveHomeHeroCarousel(site.home_page);

  return (
    <>
      <HeroSection carousel={heroCarousel} />
      <StickyBookingBar />
      <SpecialOffersSection />
      <CategorySection />
      <FuelTypeSection />
      <TopLocationsSection />
      <GiftVouchersSection />
      <FeaturedVehicles />
      <WhyChooseSection />
      <TestimonialsSection />
      <AppDownloadSection />
    </>
  );
}
