import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SVG for icon (500x500)
const iconSVG = `
<svg width="500" height="500" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <!-- Gradient background -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fefce8;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="500" height="500" fill="url(#bgGradient)"/>

  <!-- Rounded square with yellow border -->
  <rect x="110" y="105" width="280" height="280" rx="40" fill="white" stroke="#FCFF52" stroke-width="12"/>

  <!-- Yellow sparkle -->
  <text x="250" y="145" font-size="32" text-anchor="middle" fill="#FCFF52">✦</text>

  <!-- 2048 tiles inside -->
  <!-- Tile 1: "2" (beige) -->
  <rect x="150" y="185" width="80" height="80" rx="8" fill="#eee4da"/>
  <text x="190" y="240" font-size="48" font-weight="bold" text-anchor="middle" fill="#776e65">2</text>

  <!-- Tile 2: "2048" (Celo yellow gradient) -->
  <defs>
    <linearGradient id="tile2048" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FCFF52;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#fde047;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#facc15;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="270" y="185" width="80" height="80" rx="8" fill="url(#tile2048)"/>
  <text x="310" y="215" font-size="20" font-weight="bold" text-anchor="middle" fill="#1a1a1a">20</text>
  <text x="310" y="240" font-size="20" font-weight="bold" text-anchor="middle" fill="#1a1a1a">48</text>
</svg>
`;

// SVG for OG image (1200x800)
const ogImageSVG = `
<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  <!-- Gradient background - Modern gaming style -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e1b4b;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#312e81;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4c1d95;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FCFF52;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:#facc15;stop-opacity:0.1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="800" fill="url(#bgGradient)"/>

  <!-- Ambient glow -->
  <ellipse cx="300" cy="400" rx="400" ry="300" fill="url(#glowGradient)" opacity="0.4"/>
  <ellipse cx="900" cy="400" rx="350" ry="250" fill="url(#glowGradient)" opacity="0.3"/>

  <!-- Game board container with glow effect -->
  <defs>
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Icon on the left with shadow -->
  <rect x="100" y="260" width="280" height="280" rx="40" fill="rgba(255,255,255,0.95)" stroke="#FCFF52" stroke-width="8" filter="url(#glow)"/>
  <text x="240" y="310" font-size="32" text-anchor="middle" fill="#FCFF52">✦</text>

  <!-- Tiles inside icon -->
  <rect x="140" y="350" width="80" height="80" rx="8" fill="#eee4da"/>
  <text x="180" y="405" font-size="48" font-weight="bold" text-anchor="middle" fill="#776e65">2</text>

  <defs>
    <linearGradient id="tile2048og" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FCFF52;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#fde047;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#facc15;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="260" y="350" width="80" height="80" rx="8" fill="url(#tile2048og)"/>
  <text x="300" y="380" font-size="20" font-weight="bold" text-anchor="middle" fill="#1a1a1a">20</text>
  <text x="300" y="405" font-size="20" font-weight="bold" text-anchor="middle" fill="#1a1a1a">48</text>

  <!-- Text on the right -->
  <!-- Title with gradient -->
  <defs>
    <linearGradient id="titleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FCFF52;stop-opacity:1" />
    </linearGradient>
  </defs>
  <text x="500" y="340" font-size="96" font-weight="bold" fill="url(#titleGradient)" font-family="Arial, sans-serif">2048 on Celo</text>

  <!-- Subtitle -->
  <text x="500" y="420" font-size="48" fill="#e5e7eb" font-family="Arial, sans-serif">Play on Celo blockchain</text>

  <!-- Yellow underline with glow -->
  <rect x="500" y="435" width="310" height="6" fill="#FCFF52" opacity="0.8" filter="url(#glow)"/>

  <!-- Features -->
  <text x="500" y="510" font-size="36" fill="#d1d5db" font-family="Arial, sans-serif">✓ Free or On-Chain mode</text>
  <text x="500" y="570" font-size="36" fill="#d1d5db" font-family="Arial, sans-serif">✓ Track your stats</text>
  <text x="500" y="630" font-size="36" fill="#d1d5db" font-family="Arial, sans-serif">✓ Powered by Farcaster</text>
</svg>
`;

// SVG for splash (200x200)
const splashSVG = `
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Gradient background -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fefce8;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="200" height="200" fill="url(#bgGradient)"/>

  <!-- Rounded square with yellow border -->
  <rect x="45" y="42" width="112" height="112" rx="16" fill="white" stroke="#FCFF52" stroke-width="5"/>

  <!-- Yellow sparkle -->
  <text x="100" y="62" font-size="13" text-anchor="middle" fill="#FCFF52">✦</text>

  <!-- Tiles -->
  <rect x="60" y="74" width="32" height="32" rx="3" fill="#eee4da"/>
  <text x="76" y="98" font-size="19" font-weight="bold" text-anchor="middle" fill="#776e65">2</text>

  <defs>
    <linearGradient id="tile2048splash" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FCFF52;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#fde047;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#facc15;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="108" y="74" width="32" height="32" rx="3" fill="url(#tile2048splash)"/>
  <text x="124" y="88" font-size="8" font-weight="bold" text-anchor="middle" fill="#1a1a1a">20</text>
  <text x="124" y="98" font-size="8" font-weight="bold" text-anchor="middle" fill="#1a1a1a">48</text>
</svg>
`;

// Function to convert SVG to PNG
function svgToPng(svg, outputPath) {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'original',
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  fs.writeFileSync(outputPath, pngBuffer);
  console.log(`✓ Generated: ${outputPath}`);
}

// Generate all images
const publicDir = path.join(__dirname, '..', 'public');

// Create public directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating 2048 images...\n');

svgToPng(iconSVG, path.join(publicDir, 'icon.png'));
svgToPng(ogImageSVG, path.join(publicDir, 'og-image.png'));
svgToPng(splashSVG, path.join(publicDir, 'splash.png'));

console.log('\n✅ All images generated successfully!');
