"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const footerLinks = {
  "Rent a Car": [
    { href: "/vehicles", label: "All Vehicles" },
    { href: "/vehicles?category=economy", label: "Economy" },
    { href: "/vehicles?category=suv", label: "SUV" },
    { href: "/vehicles?category=premium", label: "Premium" },
  ],
  Support: [
    { href: "#", label: "Contact Us" },
    { href: "#", label: "FAQs" },
    { href: "#", label: "Terms & Conditions" },
    { href: "#", label: "Privacy Policy" },
  ],
};

export function Footer() {
  const pathname = usePathname();
  const returnUrl = encodeURIComponent(pathname ?? "/");
  const accountLinks = [
    { href: `/account/login?returnUrl=${returnUrl}`, label: "Log in" },
    { href: `/account/register?returnUrl=${returnUrl}`, label: "Register" },
    { href: "/account/bookings/upcoming", label: "My Bookings" },
  ];

  return (
    <footer className="border-t border-hertz-border bg-white">
      <div className="mx-auto max-w-container px-6 py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          <div>
            <p className="text-xl font-bold text-black">Hertz</p>
            <p className="mt-2 text-sm text-hertz-black-60">
              Premium car rental in Thailand.
            </p>
          </div>
          {[
            ...Object.entries(footerLinks),
            ["Account", accountLinks],
          ].map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-bold uppercase tracking-wide text-black">
                {title}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link: { href: string; label: string }) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-hertz-black-80 hover:text-black"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-hertz-border pt-8">
          <p className="text-center text-sm text-hertz-black-60">
            © {new Date().getFullYear()} Hertz Thailand. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
