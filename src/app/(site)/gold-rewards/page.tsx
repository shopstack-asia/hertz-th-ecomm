import { PageTemplate } from "@/components/layout/PageTemplate";

export const metadata = {
  title: "Hertz Gold Plus Rewards | Hertz Thailand",
  description: "Hertz Gold Plus Rewards program",
};

export default function GoldRewardsPage() {
  return (
    <PageTemplate
      title="Hertz Gold Plus Rewards"
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Hertz Gold Plus Rewards" }]}
    >
      <p className="text-hertz-black-80">
        Join Hertz Gold Plus Rewards and enjoy benefits including free upgrades and faster service.
      </p>
    </PageTemplate>
  );
}
