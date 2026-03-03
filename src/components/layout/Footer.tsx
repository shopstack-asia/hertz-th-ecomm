"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCookieConsent } from "@/contexts/CookieConsentContext";

type FooterLink = { href: string; labelKey: string; openCookieModal?: boolean };

const footerLinkSections: { titleKey: string; links: FooterLink[] }[] = [
  {
    titleKey: "footer.rent_a_car",
    links: [
      { href: "/vehicles", labelKey: "footer.all_vehicles" },
      { href: "/vehicles?category=economy", labelKey: "footer.economy" },
      { href: "/vehicles?category=suv", labelKey: "footer.suv" },
      { href: "/vehicles?category=premium", labelKey: "footer.premium" },
    ],
  },
  {
    titleKey: "footer.support",
    links: [
      { href: "#", labelKey: "footer.contact_us" },
      { href: "#", labelKey: "footer.faqs" },
      { href: "#", labelKey: "footer.terms_conditions" },
      { href: "#", labelKey: "footer.privacy_policy" },
      { href: "#", labelKey: "footer.cookie_settings", openCookieModal: true },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { openModal: openCookieModal } = useCookieConsent();
  const returnUrl = encodeURIComponent(pathname ?? "/");
  const accountLinks: { href: string; labelKey: string }[] = [
    { href: `/account/login?returnUrl=${returnUrl}`, labelKey: "footer.log_in" },
    { href: `/account/register?returnUrl=${returnUrl}`, labelKey: "footer.register" },
    { href: "/account/bookings/upcoming", labelKey: "footer.my_bookings" },
  ];

  return (
    <footer className="border-t border-hertz-border bg-white">
      <div className="mx-auto max-w-container px-6 py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          <div>
            <p className="text-xl font-bold text-black">Hertz</p>
            <p className="mt-2 text-sm text-hertz-black-60">
              {t("footer.hertz_tagline")}
            </p>
          </div>
          {footerLinkSections.map((section) => (
            <div key={section.titleKey}>
              <h3 className="text-sm font-bold uppercase tracking-wide text-black">
                {t(section.titleKey)}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.labelKey}>
                    {link.openCookieModal ? (
                      <button
                        type="button"
                        onClick={openCookieModal}
                        className="text-left text-sm text-hertz-black-80 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:ring-offset-2"
                      >
                        {t(link.labelKey)}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-hertz-black-80 hover:text-black"
                      >
                        {t(link.labelKey)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-black">
              {t("footer.account")}
            </h3>
            <ul className="mt-4 space-y-3">
              {accountLinks.map((link) => (
                <li key={link.labelKey}>
                  <Link
                    href={link.href}
                    className="text-sm text-hertz-black-80 hover:text-black"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-hertz-border pt-8">
          <p className="text-center text-sm text-hertz-black-60">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
