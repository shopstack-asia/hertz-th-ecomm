import { PageTemplate } from "@/components/layout/PageTemplate";

export const metadata = {
  title: "Vehicles Guide | Hertz Thailand",
  description: "Vehicle guide and car categories",
};

export default function VehicleGuidePage() {
  return (
    <PageTemplate
      title="Vehicles Guide"
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Vehicles Guide" }]}
    >
      <p className="text-hertz-black-80">
        Learn about our vehicle categories from economy to luxury.
      </p>
    </PageTemplate>
  );
}
