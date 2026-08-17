"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

export function OpenPlatformButton() {
  const router = useRouter();
  const { user, loading } = useUser();

  const handleOpenPlatform = () => {
    if (loading) return;

    if (!user) {
      router.push("/auth/login?next=/dashboard");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <button
      onClick={handleOpenPlatform}
      className="
        group
        bg-[var(--text-primary)]
        px-7 py-3
        font-mono text-[10px]
        tracking-[0.18em]
        text-[var(--surface-solid)]
        transition-all duration-300
        hover:bg-[var(--accent)]
        hover:-translate-y-[1px]
      "
    >
      OPEN PLATFORM
      <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
        →
      </span>
    </button>
  );
}
