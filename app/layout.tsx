import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

// Auto-detect production URL or use environment variable
const getBaseUrl = () => {
  // Priority 1: Explicit environment variable
  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL;
  }

  // Priority 2: Vercel automatic URL (only in production)
  if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Priority 3: Localhost fallback
  return 'http://localhost:3000';
};

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "2048 on Celo",
  description: "Slide tiles to reach 2048! Play free or compete on Celo blockchain.",
  manifest: "/manifest.json",
  openGraph: {
    title: "2048 on Celo",
    description: "Slide tiles and reach 2048! Play free or compete on-chain.",
    url: baseUrl,
    siteName: "2048 on Celo",
    type: "website",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "2048 on Celo - Play on-chain",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "2048 on Celo",
    description: "Play 2048 on-chain with Farcaster!",
    images: [`${baseUrl}/og-image.png`],
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  other: {
    // Farcaster Frame tags
    "fc:frame": "vNext",
    "fc:frame:image": `${baseUrl}/og-image.png`,
    "fc:frame:image:aspect_ratio": "1.91:1",
    "fc:frame:button:1": "Play 2048",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": baseUrl,
    // Farcaster Mini-app
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: `${baseUrl}/og-image.png`,
      button: {
        title: "Play 2048",
        action: {
          type: "launch_miniapp",
          name: "2048 on Celo",
          url: baseUrl,
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-gray-100 via-gray-50 to-yellow-50/20 min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
