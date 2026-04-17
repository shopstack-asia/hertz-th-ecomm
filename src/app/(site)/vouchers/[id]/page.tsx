"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LoginModal } from "@/components/auth/LoginModal";
import { useAuth } from "@/contexts/auth_context";
import { VoucherProductTile } from "@/components/voucher/VoucherProductTile";
import type { VoucherCatalogItem } from "@/app/api/vouchers/catalog/route";

export default function VoucherDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { authenticated, refreshAuth } = useAuth();
  const [voucher, setVoucher] = useState<VoucherCatalogItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch("/api/vouchers/catalog")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data.vouchers) ? data.vouchers : [];
        const found = list.find((v: VoucherCatalogItem) => v.id === id);
        setVoucher(found ?? null);
      })
      .catch(() => setVoucher(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBuyNow = () => {
    if (!authenticated) {
      setLoginOpen(true);
      return;
    }
    router.push(`/voucher-checkout?voucher_id=${encodeURIComponent(id)}&quantity=${quantity}`);
  };

  const handleLoginSuccess = () => {
    setLoginOpen(false);
    router.push(`/voucher-checkout?voucher_id=${encodeURIComponent(id)}&quantity=${quantity}`);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-container px-12 py-12">
        <div className="h-96 animate-pulse bg-hertz-gray" />
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="mx-auto max-w-container px-12 py-12 text-center">
        <p className="text-hertz-black-80">Voucher not found.</p>
        <Link href="/vouchers" className="mt-4 inline-block font-bold text-black underline">
          Back to vouchers
        </Link>
      </div>
    );
  }

  const validityText =
    voucher.validity_days >= 365
      ? "Valid 1 year from purchase"
      : `Valid ${voucher.validity_days} days from purchase`;

  const valueLabel =
    voucher.type === "FIXED"
      ? `฿${voucher.value.toLocaleString()}`
      : voucher.type === "PERCENT"
        ? `${voucher.value}% off`
        : voucher.product_category;

  return (
    <div className="mx-auto max-w-container px-12 py-8 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="overflow-hidden rounded border border-hertz-border">
            <VoucherProductTile
              cardStyle={voucher.card_style}
              value={voucher.value}
              label={voucher.product_category}
              static
            />
          </div>
          <span className="mt-4 block text-[10px] font-bold uppercase tracking-wider text-hertz-black-60">
            {voucher.product_category}
          </span>
          <h1 className="mt-1 text-2xl font-bold text-black">{voucher.title}</h1>
          <p className="mt-4 text-hertz-black-80">{voucher.description}</p>

          {voucher.terms && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-black">Terms &amp; conditions</h2>
              <p className="mt-2 whitespace-pre-line text-sm text-hertz-black-80">
                {voucher.terms}
              </p>
            </div>
          )}
          {voucher.usage_rules && (
            <div className="mt-6">
              <h2 className="text-lg font-bold text-black">Usage rules</h2>
              <p className="mt-2 whitespace-pre-line text-sm text-hertz-black-80">
                {voucher.usage_rules}
              </p>
            </div>
          )}
          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="text-hertz-black-60">Expiry:</dt>
              <dd className="text-black">{validityText}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-hertz-black-60">Transferable:</dt>
              <dd className="text-black">{voucher.transferable ? "Yes" : "No"}</dd>
            </div>
          </dl>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-hertz-border bg-white p-6">
            <h2 className="text-lg font-bold text-black">{voucher.title}</h2>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-hertz-black-80">Voucher value</span>
                <span className="font-bold text-black">{valueLabel}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-hertz-black-80">Selling price</span>
                <span className="font-bold text-black">
                  ฿{voucher.selling_price.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-hertz-black-80">
                Quantity
              </label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-2 w-full border border-hertz-border px-4 py-3 text-black"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleBuyNow}
              className="mt-6 flex h-12 w-full items-center justify-center bg-[#FFCC00] font-bold text-black"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
