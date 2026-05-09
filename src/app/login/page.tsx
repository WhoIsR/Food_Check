"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home and trigger the modal via query param
    router.replace("/?auth=true");
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-[var(--text-secondary)] border-t-[var(--accent)] animate-spin" />
    </div>
  );
}
