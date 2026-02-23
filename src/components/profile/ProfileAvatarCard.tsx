"use client";

import { ProfileAvatar } from "./ProfileAvatar";

interface ProfileAvatarCardProps {
  avatarUrl: string | null | undefined;
  onUploaded: (url: string) => void;
  onRemove: () => void;
}

export function ProfileAvatarCard({
  avatarUrl,
  onUploaded,
  onRemove,
}: ProfileAvatarCardProps) {
  return (
    <div className="rounded-2xl border border-hertz-border bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg">
      <h3 className="text-center text-xs font-bold uppercase tracking-wide text-hertz-black-60">
        Profile Photo
      </h3>
      <div className="mt-4 flex flex-col items-center">
        <ProfileAvatar
          avatarUrl={avatarUrl}
          onUploaded={onUploaded}
          onRemove={onRemove}
          size="lg"
        />
      </div>
    </div>
  );
}
