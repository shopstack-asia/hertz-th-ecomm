"use client";

import { useEffect, useState, useCallback } from "react";
import { FormField } from "@/components/ui/FormField";
import { LoyaltyCard } from "@/components/loyalty-card/LoyaltyCard";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { DocumentUploadWithExpiry } from "@/components/profile/DocumentUploadWithExpiry";
import { OtpModal } from "@/components/profile/OtpModal";
import * as profileService from "@/services/profile.service";
import * as loyaltyService from "@/services/loyalty.service";
import type { AccountProfile, LoyaltyProfile } from "@/types/account";
import { useAuth } from "@/contexts/auth_context";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProfilePage() {
  const { refreshAuth } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [loyalty, setLoyalty] = useState<LoyaltyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [otpModal, setOtpModal] = useState<{
    open: true;
    type: "email" | "phone";
    newValue: string;
  } | { open: false }>({ open: false });
  const [initialEmail, setInitialEmail] = useState("");
  const [initialPhone, setInitialPhone] = useState("");

  const loadProfile = useCallback(async () => {
    try {
      const [p, l] = await Promise.all([
        profileService.getProfile(),
        loyaltyService.getLoyaltyProfile(),
      ]);
      if (p) {
        setProfile(p);
        setInitialEmail(p.email);
        setInitialPhone(p.phone ?? "");
      } else {
        setProfile(null);
      }
      setLoyalty(l ?? null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    const emailChanged = profile.email !== initialEmail;
    const phoneChanged = (profile.phone ?? "") !== initialPhone;

    if (emailChanged || phoneChanged) {
      if (emailChanged && profile.email) {
        setOtpModal({ open: true, type: "email", newValue: profile.email });
        return;
      }
      if (phoneChanged && profile.phone) {
        setOtpModal({ open: true, type: "phone", newValue: profile.phone });
        return;
      }
    }

    setSaving(true);
    try {
      const updated = await profileService.updateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        identity_document_type: profile.identity_document_type,
        identity_document_url: profile.identity_document_url ?? undefined,
        identity_document_expiry: profile.identity_document_expiry || undefined,
        driver_license_url: profile.driver_license_url ?? undefined,
        driver_license_expiry: profile.driver_license_expiry || undefined,
      });
      setProfile(updated);
      await refreshAuth();
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUploaded = useCallback(
    (url: string) => {
      setProfile((prev) => (prev ? { ...prev, avatar_url: url } : null));
      refreshAuth();
    },
    [refreshAuth]
  );

  const handleAvatarRemove = useCallback(async () => {
    if (!profile) return;
    await profileService.updateProfile(
      { ...profile, avatar_url: null } as unknown as Parameters<
        typeof profileService.updateProfile
      >[0]
    );
    setProfile((prev) => (prev ? { ...prev, avatar_url: undefined } : null));
    refreshAuth();
  }, [profile, refreshAuth]);

  const handleOtpSuccess = useCallback(() => {
    setOtpModal({ open: false });
    loadProfile();
    refreshAuth();
  }, [loadProfile, refreshAuth]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1100px] px-4 py-8">
        <div className="h-48 animate-pulse rounded-2xl bg-hertz-gray" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-[1100px] px-4 py-8">
        <p className="text-hertz-black-80">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 md:py-12">
      <h1 className="mb-8 text-2xl font-bold text-hertz-black-90">
        My profile
      </h1>

      {/* Row: profile photo + member card */}
      <div className="mb-8 flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
        <ProfileAvatar
          avatarUrl={profile.avatar_url}
          onUploaded={handleAvatarUploaded}
          onRemove={handleAvatarRemove}
          size="xl"
          compact
        />
        {loyalty && (
          <div className="min-w-0 flex-1">
            <LoyaltyCard data={loyalty} variant="header" />
          </div>
        )}
      </div>

      {/* Form */}
      <div className="flex min-w-0 flex-col gap-8">
        <div className="rounded-2xl border border-hertz-border bg-white p-6 shadow-sm md:p-8">
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    label="First name"
                    labelStyle="dashboard"
                    value={profile.firstName}
                    onChange={(e) =>
                      setProfile({ ...profile, firstName: e.target.value })
                    }
                  />
                  <FormField
                    label="Last name"
                    labelStyle="dashboard"
                    value={profile.lastName}
                    onChange={(e) =>
                      setProfile({ ...profile, lastName: e.target.value })
                    }
                  />
                </div>
                <FormField
                  label="Email"
                  labelStyle="dashboard"
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
                <FormField
                  label="Phone"
                  labelStyle="dashboard"
                  type="tel"
                  value={profile.phone ?? ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      phone: e.target.value || undefined,
                    })
                  }
                />
              </div>
              <p className="mt-4 text-xs text-hertz-black-60">
                Changing email or phone requires verification via code sent to
                the new value.
              </p>

              <div className="mt-8 space-y-6">
                <DocumentUploadWithExpiry
                  label={t("profile.identity_document")}
                  hint={t("profile.identity_document_hint")}
                  documentUrl={profile.identity_document_url}
                  expiry={profile.identity_document_expiry ?? ""}
                  onDocumentChange={(url) =>
                    setProfile((p) =>
                      p
                        ? {
                            ...p,
                            identity_document_url: url ?? undefined,
                            ...(url == null && {
                              identity_document_expiry: undefined,
                            }),
                          }
                        : null
                    )
                  }
                  onExpiryChange={(value) =>
                    setProfile((p) =>
                      p ? { ...p, identity_document_expiry: value || undefined } : null
                    )
                  }
                  docType="identity"
                  expiryLabel={t("profile.document_expiry")}
                  uploadLabel={t("profile.upload_document")}
                  uploadedLabel={t("profile.document_uploaded")}
                  removeLabel={t("profile.remove_document")}
                  documentTypeDropdown={{
                    value: profile.identity_document_type ?? "",
                    placeholder: t("profile.identity_document_type_placeholder"),
                    options: [
                      { value: "id_card", label: t("profile.identity_document_type_id_card") },
                      { value: "passport", label: t("profile.identity_document_type_passport") },
                    ],
                    onChange: (value) =>
                      setProfile((p) =>
                        p ? { ...p, identity_document_type: value } : null
                      ),
                  }}
                  expiryReadonly
                />
                <DocumentUploadWithExpiry
                  label={t("profile.driver_license")}
                  hint={t("profile.driver_license_hint")}
                  documentUrl={profile.driver_license_url}
                  expiry={profile.driver_license_expiry ?? ""}
                  onDocumentChange={(url) =>
                    setProfile((p) =>
                      p
                        ? {
                            ...p,
                            driver_license_url: url ?? undefined,
                            ...(url == null && { driver_license_expiry: undefined }),
                          }
                        : null
                    )
                  }
                  onExpiryChange={(value) =>
                    setProfile((p) =>
                      p ? { ...p, driver_license_expiry: value || undefined } : null
                    )
                  }
                  docType="driver_license"
                  expiryLabel={t("profile.document_expiry")}
                  uploadLabel={t("profile.upload_document")}
                  uploadedLabel={t("profile.document_uploaded")}
                  removeLabel={t("profile.remove_document")}
                  expiryReadonly
                />
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-hertz-yellow font-semibold text-hertz-black-90 shadow-sm transition-colors hover:bg-hertz-yellow/90 focus:outline-none focus:ring-2 focus:ring-hertz-yellow focus:ring-offset-2 disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
      </div>

      {otpModal.open && (
        <OtpModal
          open={true}
          onClose={() => setOtpModal({ open: false })}
          type={otpModal.type}
          newValue={otpModal.newValue}
          onSuccess={handleOtpSuccess}
          onRequestOtp={() =>
            profileService.requestOtp(otpModal.type, otpModal.newValue)
          }
          onVerifyOtp={(otp) =>
            profileService.verifyOtp(
              otpModal.type,
              otpModal.newValue,
              otp
            )
          }
        />
      )}
    </div>
  );
}
