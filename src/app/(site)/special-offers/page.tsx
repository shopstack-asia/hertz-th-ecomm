import { PageTemplate } from "@/components/layout/PageTemplate";

export const metadata = {
  title: "Special Offers | Hertz Thailand",
  description: "Special offers and promotions",
};

export default function SpecialOffersPage() {
  return (
    <PageTemplate
      title="Special Offers"
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Special Offers" }]}
    >
      <p className="text-hertz-black-80">
        Explore our latest promotions and special offers on car rentals across Thailand.
      </p>
    </PageTemplate>
  );
}
