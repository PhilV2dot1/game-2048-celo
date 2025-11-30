import sdk from "@farcaster/miniapp-sdk";

export interface GameStats {
  wins: number;
  losses: number;
  totalGames: number;
  currentStreak: number;
  bestStreak: number;
}

export function isFarcasterContext(): boolean {
  if (typeof window === "undefined") return false;
  return (
    (window as Window & { fc?: unknown; farcaster?: unknown }).fc !== undefined ||
    (window as Window & { fc?: unknown; farcaster?: unknown }).farcaster !== undefined ||
    document.referrer.includes("warpcast.com")
  );
}

export async function initializeFarcaster(): Promise<boolean> {
  try {
    // ALWAYS call ready() to dismiss splash screen
    await sdk.actions.ready();

    if (!isFarcasterContext()) {
      console.log("Not in Farcaster context, SDK ready but features disabled");
      return false;
    }

    console.log("Farcaster SDK initialized successfully");
    return true;
  } catch (error) {
    console.error("Failed to initialize Farcaster SDK:", error);
    // Fallback: still try to dismiss splash
    try {
      await sdk.actions.ready();
    } catch (readyError) {
      console.error("Failed to call ready():", readyError);
    }
    return false;
  }
}

export async function share2048Result(
  gamePhase: 'won' | 'lost',
  score: number,
  stats: GameStats,
  appUrl: string
) {
  const emoji = gamePhase === 'won' ? '🎉' : '😢';
  const result = gamePhase === 'won' ? 'WON' : 'LOST';

  const text = `I just played 2048 on Celo!\n\n${emoji} ${result} - Score: ${score}\n\nStats: ${stats.wins}W / ${stats.losses}L / ${stats.totalGames} games\n\nPlay now:`;

  const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(appUrl)}`;

  if (!isFarcasterContext()) {
    window.open(shareUrl, "_blank");
    return;
  }

  try {
    await sdk.actions.openUrl(shareUrl);
  } catch (error) {
    console.error("Failed to open Farcaster share URL:", error);
    window.open(shareUrl, "_blank");
  }
}
