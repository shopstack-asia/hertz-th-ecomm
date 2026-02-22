import { PageTemplate } from "@/components/layout/PageTemplate";

export const metadata = {
  title: "Locations | Hertz Thailand",
  description: "Hertz rental locations in Thailand",
};

export default function LocationsPage() {
  return (
    <PageTemplate
      title="Locations"
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Locations" }]}
    >
      <p className="text-hertz-black-80">
        Find Hertz rental locations at airports and cities across Thailand.
      </p>
    </PageTemplate>
  );
}
