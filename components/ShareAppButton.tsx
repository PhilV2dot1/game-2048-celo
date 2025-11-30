"use client";

import { useState } from "react";
import { shareApp } from "@/lib/farcaster";

export function ShareAppButton() {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const appUrl = typeof window !== 'undefined' ? window.location.origin : '';
      await shareApp(appUrl);
    } catch (error) {
      console.error("Error sharing app:", error);
    } finally {
      setTimeout(() => setIsSharing(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm flex items-center gap-2"
    >
      <span>📣</span>
      <span className="hidden sm:inline">{isSharing ? "Sharing..." : "Share App"}</span>
      <span className="sm:hidden">{isSharing ? "..." : "Share"}</span>
    </button>
  );
}
