// Immediate Farcaster SDK initialization
// This runs as soon as the module is imported, before React renders
import sdk from "@farcaster/miniapp-sdk";

if (typeof window !== "undefined") {
  // Call ready() immediately to dismiss splash screen
  sdk.actions.ready().catch((error) => {
    console.error("Failed to call Farcaster ready():", error);
  });
}
