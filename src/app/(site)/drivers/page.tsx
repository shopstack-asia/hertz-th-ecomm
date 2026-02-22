import { PageTemplate } from "@/components/layout/PageTemplate";

export const metadata = {
  title: "Drivers | Hertz Thailand",
  description: "Chauffeur and driver services",
};

export default function DriversPage() {
  return (
    <PageTemplate
      title="Drivers"
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Drivers" }]}
    >
      <p className="text-hertz-black-80">
        Hire a professional driver for your rental. Available for airport transfers and extended trips.
      </p>
    </PageTemplate>
  );
}
