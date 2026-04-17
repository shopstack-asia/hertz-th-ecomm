import { HeroSection } from "@/components/home/HeroSection";
import { getWebsiteConfig } from "@/lib/cms/site-config";
import { resolveHomeHeroCarousel } from "@/lib/cms/websiteHomeHeroCarousel";
import { resolveMembersLoyaltyProgramSection } from "@/lib/cms/websiteHomeMembersLoyalty";
import { resolveExploreLocationsSection } from "@/lib/cms/websiteHomeExploreLocations";
import { resolveHomeExclusiveOffers } from "@/lib/cms/websiteHomeExclusiveOffers";
import { MembersLoyaltyProgramSection } from "@/components/home/MembersLoyaltyProgramSection";
import { ExploreLocationsSection } from "@/components/home/ExploreLocationsSection";
import { StickyBookingBar } from "@/components/booking/StickyBookingBar";
import { SpecialOffersSection } from "@/components/home/SpecialOffersSection";
import { ExclusiveOffersSection } from "@/components/home/ExclusiveOffersSection";
import { CategorySection } from "@/components/home/CategorySection";
import { FuelTypeSection } from "@/components/home/FuelTypeSection";
import { GiftVouchersSection } from "@/components/home/GiftVouchersSection";
import { FeaturedVehicles } from "@/components/home/FeaturedVehicles";
import { WhyChooseSection } from "@/components/home/WhyChooseSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { AppDownloadSection } from "@/components/home/AppDownloadSection";

export default async function HomePage() {
  const site = await getWebsiteConfig();
  const heroCarousel = resolveHomeHeroCarousel(site.home_page);
  const membersLoyalty = resolveMembersLoyaltyProgramSection(site.home_page);
  const exploreLocations = resolveExploreLocationsSection(site.home_page);
  const exclusiveOffers = resolveHomeExclusiveOffers(site.home_page);

  return (
    <>
      <HeroSection carousel={heroCarousel} />
      <MembersLoyaltyProgramSection data={membersLoyalty} />
      <ExploreLocationsSection data={exploreLocations} />
      <ExclusiveOffersSection data={exclusiveOffers} />
      <StickyBookingBar />
      <SpecialOffersSection />
      <CategorySection />
      <FuelTypeSection />
      <GiftVouchersSection />
      <FeaturedVehicles />
      <WhyChooseSection />
      <TestimonialsSection />
      <AppDownloadSection />
    </>
  );
}
