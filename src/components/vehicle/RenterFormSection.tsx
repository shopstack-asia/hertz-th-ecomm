"use client";

import { FormField } from "@/components/ui/FormField";
import { useLanguage } from "@/contexts/LanguageContext";

interface AuthUser {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
}

interface RenterFormSectionProps {
  renterName: string;
  contactEmail: string;
  contactPhone: string;
  driverName: string;
  onRenterNameChange: (v: string) => void;
  onContactEmailChange: (v: string) => void;
  onContactPhoneChange: (v: string) => void;
  onDriverNameChange: (v: string) => void;
  /** When false, show "Log in to book faster" CTA. When true, show "Signed in as ...". */
  isAuthed?: boolean;
  authUser?: AuthUser | null;
  onLoginClick?: () => void;
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
  isAuthed = false,
  authUser = null,
  onLoginClick,
}: RenterFormSectionProps) {
  const { t } = useLanguage();

  return (
    <section className="border border-hertz-border bg-white p-6">
      <h2 className="text-lg font-bold text-black">Renter &amp; contact</h2>

      {!isAuthed && onLoginClick ? (
        <div className="mt-6 rounded-xl border border-hertz-border bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-hertz-gray/60 text-hertz-black-80">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-black">
                  {t("checkout.login_title")}
                </p>
                <p className="mt-1 text-sm text-hertz-black-60">
                  {t("checkout.login_body")}
                </p>
              </div>
            </div>
            <div className="flex shrink-0">
              <button
                type="button"
                onClick={onLoginClick}
                className="flex h-12 min-w-[120px] items-center justify-center rounded-xl bg-hertz-yellow font-bold text-hertz-black-90"
              >
                {t("checkout.log_in")}
              </button>
            </div>
          </div>
        </div>
      ) : isAuthed && authUser ? (
        <p className="mt-2 text-sm text-hertz-black-60">
          {t("checkout.signed_in_as").replace(
            "{name}",
            `${authUser.first_name} ${authUser.last_name}`.trim()
          )}
        </p>
      ) : null}

      {isAuthed && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
      )}
    </section>
  );
}
