"use client";

import { useEffect, useState } from "react";
import { FormField } from "@/components/ui/FormField";
import { proxyFetch } from "@/lib/api/proxy_fetch";
import type { AccountProfile } from "@/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    proxyFetch<AccountProfile>("/api/account/profile")
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    await proxyFetch<AccountProfile>("/api/account/profile", {
      method: "PUT",
      body: JSON.stringify(profile),
    })
      .then(setProfile)
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-4 py-8">
        <div className="h-48 animate-pulse rounded-2xl bg-gray-200" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-hertz-black-90">
        My profile
      </h1>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card"
      >
        <div className="space-y-4">
          <FormField
            label="First name"
            value={profile.firstName}
            onChange={(e) =>
              setProfile({ ...profile, firstName: e.target.value })
            }
          />
          <FormField
            label="Last name"
            value={profile.lastName}
            onChange={(e) =>
              setProfile({ ...profile, lastName: e.target.value })
            }
          />
          <FormField
            label="Email"
            type="email"
            value={profile.email}
            onChange={(e) =>
              setProfile({ ...profile, email: e.target.value })
            }
          />
          <FormField
            label="Phone"
            type="tel"
            value={profile.phone ?? ""}
            onChange={(e) =>
              setProfile({ ...profile, phone: e.target.value })
            }
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-hertz-yellow font-semibold text-hertz-black-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
