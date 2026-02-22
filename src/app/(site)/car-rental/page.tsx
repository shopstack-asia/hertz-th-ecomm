import { PageTemplate } from "@/components/layout/PageTemplate";

export const metadata = {
  title: "Car Rental | Hertz Thailand",
  description: "Rent a car in Thailand",
};

export default function CarRentalPage() {
  return (
    <PageTemplate
      title="Car Rental"
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Car Rental" }]}
    >
      <p className="text-hertz-black-80">
        Book your rental car with Hertz Thailand. Choose from economy to luxury vehicles.
      </p>
    </PageTemplate>
  );
}
