"use client";

import { FormField } from "@/components/ui/FormField";

interface RenterFormSectionProps {
  renterName: string;
  contactEmail: string;
  contactPhone: string;
  driverName: string;
  onRenterNameChange: (v: string) => void;
  onContactEmailChange: (v: string) => void;
  onContactPhoneChange: (v: string) => void;
  onDriverNameChange: (v: string) => void;
}

export function RenterFormSection({
  renterName,
  contactEmail,
  contactPhone,
  driverName,
  onRenterNameChange,
  onContactEmailChange,
  onContactPhoneChange,
  onDriverNameChange,
}: RenterFormSectionProps) {
  return (
    <section className="border border-hertz-border bg-white p-6">
      <h2 className="text-lg font-bold text-black">Renter &amp; contact</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <FormField
          label="Full name (renter)"
          value={renterName}
          onChange={(e) => onRenterNameChange(e.target.value)}
          required
        />
        <FormField
          label="Driver name (if different)"
          value={driverName}
          onChange={(e) => onDriverNameChange(e.target.value)}
          placeholder="Optional"
        />
        <FormField
          label="Email"
          type="email"
          value={contactEmail}
          onChange={(e) => onContactEmailChange(e.target.value)}
          required
        />
        <FormField
          label="Phone"
          type="tel"
          value={contactPhone}
          onChange={(e) => onContactPhoneChange(e.target.value)}
          required
        />
      </div>
    </section>
  );
}
