import { PageTemplate } from "@/components/layout/PageTemplate";

export const metadata = {
  title: "Products & Services | Hertz Thailand",
  description: "Hertz products and services",
};

export default function ProductsServicesPage() {
  return (
    <PageTemplate
      title="Products & Services"
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Products & Services" }]}
    >
      <p className="text-hertz-black-80">
        Explore additional products and services including insurance, GPS, and child seats.
      </p>
    </PageTemplate>
  );
}
