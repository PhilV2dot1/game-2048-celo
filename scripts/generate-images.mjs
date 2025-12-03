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

// SVG for OG image (1200x630) - EXACT Blackjack style
const ogImageSVG = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <!-- Gradient background - EXACT Blackjack colors -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#fefce8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fef3c7;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="tile2048og" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FCFF52;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#fde047;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#facc15;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGradient)"/>

  <!-- White card on left with yellow border - EXACT position as Blackjack -->
  <rect x="110" y="165" width="225" height="300" rx="30" fill="white" stroke="#FCFF52" stroke-width="6"/>

  <!-- Yellow sparkle at top -->
  <text x="222" y="210" font-size="24" text-anchor="middle" fill="#FCFF52">✦</text>

  <!-- 2048 tiles inside (replacing playing cards) -->
  <!-- Tile 1: "2" (beige) - left side -->
  <rect x="140" y="255" width="70" height="70" rx="6" fill="#eee4da"/>
  <text x="175" y="302" font-size="40" font-weight="bold" text-anchor="middle" fill="#776e65">2</text>

  <!-- Tile 2: "2048" (yellow gradient) - right side -->
  <rect x="235" y="255" width="70" height="70" rx="6" fill="url(#tile2048og)"/>
  <text x="270" y="282" font-size="18" font-weight="bold" text-anchor="middle" fill="#1a1a1a">20</text>
  <text x="270" y="302" font-size="18" font-weight="bold" text-anchor="middle" fill="#1a1a1a">48</text>

  <!-- Tile 3: "4" (darker beige) - bottom left -->
  <rect x="140" y="345" width="70" height="70" rx="6" fill="#ede0c8"/>
  <text x="175" y="392" font-size="40" font-weight="bold" text-anchor="middle" fill="#776e65">4</text>

  <!-- Tile 4: "8" (orange) - bottom right -->
  <rect x="235" y="345" width="70" height="70" rx="6" fill="#f2b179"/>
  <text x="270" y="392" font-size="40" font-weight="bold" text-anchor="middle" fill="#ffffff">8</text>

  <!-- Text on the right - EXACT Blackjack positioning -->
  <!-- Main title -->
  <text x="440" y="235" font-size="80" font-weight="bold" fill="#1a1a1a" font-family="Arial, sans-serif">2048 on Celo</text>

  <!-- Subtitle -->
  <text x="440" y="300" font-size="38" fill="#6b7280" font-family="Arial, sans-serif">Play on Celo blockchain</text>

  <!-- Features with checkmarks -->
  <text x="440" y="375" font-size="28" fill="#6b7280" font-family="Arial, sans-serif">✓ Free or On-Chain mode</text>
  <text x="440" y="425" font-size="28" fill="#6b7280" font-family="Arial, sans-serif">✓ Track your stats</text>
  <text x="440" y="475" font-size="28" fill="#6b7280" font-family="Arial, sans-serif">✓ Powered by Farcaster</text>
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
