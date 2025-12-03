import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://game-2048-celo.vercel.app';

export const metadata: Metadata = {
  title: "2048 on Celo",
  description: "Play 2048 on-chain! Free mode or compete on Celo blockchain.",
  manifest: "/manifest.json",
  openGraph: {
    title: "2048 on Celo",
    description: "Play 2048 on-chain with Farcaster!",
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
