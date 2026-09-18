import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.join(__dirname, '../public/instagram');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. MEGA OFERTAS INTRO
const svg1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
  <defs>
    <linearGradient id="bgGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#fff8f2"/>
    </linearGradient>
    <filter id="shadow1" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.15"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="600" height="750" fill="url(#bgGrad1)" rx="24"/>
  <rect x="8" y="8" width="584" height="734" fill="none" stroke="#f97316" stroke-width="4" rx="20"/>

  <!-- Top Koala Mascot -->
  <g transform="translate(300, 115)">
    <!-- Ears -->
    <circle cx="-65" cy="-35" r="34" fill="#94a3b8"/>
    <circle cx="-65" cy="-35" r="22" fill="#fbcfe8"/>
    <circle cx="65" cy="-35" r="34" fill="#94a3b8"/>
    <circle cx="65" cy="-35" r="22" fill="#fbcfe8"/>
    <!-- Head -->
    <ellipse cx="0" cy="0" rx="60" ry="50" fill="#cbd5e1"/>
    <!-- Cheeks -->
    <circle cx="-35" cy="12" r="10" fill="#f472b6" opacity="0.6"/>
    <circle cx="35" cy="12" r="10" fill="#f472b6" opacity="0.6"/>
    <!-- Eyes -->
    <ellipse cx="-22" cy="-6" rx="8" ry="11" fill="#0f172a"/>
    <circle cx="-20" cy="-9" r="3.5" fill="#ffffff"/>
    <ellipse cx="22" cy="-6" rx="8" ry="11" fill="#0f172a"/>
    <circle cx="24" cy="-9" r="3.5" fill="#ffffff"/>
    <!-- Nose -->
    <ellipse cx="0" cy="4" rx="18" ry="24" fill="#475569"/>
    <!-- Smile -->
    <path d="M -12 24 Q 0 34 12 24" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
    <!-- Body & Waving Arms -->
    <path d="M -30 45 C -45 60 -40 100 0 100 C 40 100 45 60 30 45" fill="#94a3b8"/>
    <ellipse cx="0" cy="72" rx="22" ry="20" fill="#ffffff"/>
    <!-- Waving Left Hand -->
    <path d="M -35 55 Q -65 40 -60 20 Q -45 25 -35 45" fill="#94a3b8"/>
    <!-- Waving Right Hand -->
    <path d="M 35 55 Q 65 40 60 20 Q 45 25 35 45" fill="#94a3b8"/>
  </g>

  <!-- Brand Title -->
  <g transform="translate(300, 260)" text-anchor="middle">
    <text font-family="'Fredoka', system-ui, -apple-system, sans-serif" font-weight="900" font-size="52" fill="#ea580c" stroke="#9a3412" stroke-width="2" letter-spacing="-1">
      Koala
    </text>
    <text y="42" font-family="'Fredoka', system-ui, -apple-system, sans-serif" font-weight="800" font-size="34" fill="#1e293b">
      Lo tiene!
    </text>
  </g>

  <!-- Headline: ¡MEGA OFERTAS en Koala! -->
  <g transform="translate(300, 365)" text-anchor="middle">
    <text font-family="'Fredoka', system-ui, -apple-system, sans-serif" font-weight="900" font-size="44" fill="#f97316" stroke="#0f172a" stroke-width="4" paint-order="stroke fill" letter-spacing="0">
      ¡MEGA OFERTAS
    </text>
    <text y="52" font-family="'Fredoka', system-ui, -apple-system, sans-serif" font-weight="900" font-size="46" fill="#0f172a">
      en Koala!
    </text>
  </g>

  <!-- Product Assortment Illustrations -->
  <g transform="translate(40, 450)">
    <!-- 1. Balloons Bundle (Left) -->
    <g transform="translate(80, 50)">
      <ellipse cx="-30" cy="-20" rx="22" ry="28" fill="#ef4444"/>
      <ellipse cx="25" cy="-25" rx="20" ry="26" fill="#3b82f6"/>
      <ellipse cx="-5" cy="-45" rx="24" ry="30" fill="#eab308"/>
      <ellipse cx="-20" cy="15" rx="18" ry="24" fill="#ec4899"/>
      <ellipse cx="20" cy="10" rx="20" ry="26" fill="#06b6d4"/>
      <ellipse cx="0" cy="-10" rx="22" ry="28" fill="#10b981"/>
      <!-- Strings -->
      <path d="M 0 18 L 0 85 M -20 38 L 0 85 M 20 35 L 0 85" stroke="#94a3b8" stroke-width="2"/>
      <!-- Gift bags -->
      <rect x="-35" y="80" width="30" height="38" rx="4" fill="#f472b6" stroke="#db2777" stroke-width="2"/>
      <rect x="5" y="80" width="30" height="38" rx="4" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
    </g>

    <!-- 2. Packaging Film Rolls (Center) -->
    <g transform="translate(260, 50)">
      <rect x="-45" y="-10" width="35" height="100" rx="6" fill="#d97706" stroke="#78350f" stroke-width="2"/>
      <ellipse cx="-27.5" cy="-10" rx="17.5" ry="8" fill="#fef3c7" stroke="#78350f" stroke-width="2"/>
      
      <rect x="-5" y="-30" width="38" height="120" rx="6" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
      <ellipse cx="14" cy="-30" rx="19" ry="8" fill="#f8fafc" stroke="#475569" stroke-width="2"/>
      
      <rect x="38" y="10" width="30" height="80" rx="6" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
      <ellipse cx="53" cy="10" rx="15" ry="7" fill="#ffffff" stroke="#64748b" stroke-width="2"/>
      
      <!-- Horizontal rolls at bottom -->
      <rect x="-35" y="85" width="80" height="24" rx="6" fill="#b45309" stroke="#78350f" stroke-width="2"/>
      <circle cx="-35" cy="97" r="12" fill="#fed7aa" stroke="#78350f" stroke-width="2"/>
    </g>

    <!-- 3. Party Supplies & Stationery (Right) -->
    <g transform="translate(430, 50)">
      <!-- Party plate -->
      <circle cx="0" cy="40" r="32" fill="#fbcfe8" stroke="#db2777" stroke-width="3"/>
      <circle cx="0" cy="40" r="22" fill="#ffffff" stroke="#f472b6" stroke-width="2" stroke-dasharray="4,3"/>
      <!-- Stickers pack -->
      <rect x="-25" y="-35" width="55" height="70" rx="4" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" filter="url(#shadow1)"/>
      <rect x="-25" y="-35" width="55" height="18" fill="#ec4899"/>
      <circle cx="-10" cy="0" r="6" fill="#f59e0b"/>
      <circle cx="12" cy="0" r="6" fill="#10b981"/>
      <circle cx="0" cy="18" r="6" fill="#3b82f6"/>
      <!-- Markers -->
      <rect x="35" y="-25" width="8" height="50" rx="2" fill="#ef4444"/>
      <rect x="45" y="-20" width="8" height="45" rx="2" fill="#3b82f6"/>
      <rect x="55" y="-15" width="8" height="40" rx="2" fill="#eab308"/>
    </g>
  </g>

  <!-- Footer Banner -->
  <g transform="translate(300, 695)" text-anchor="middle">
    <text font-family="'Fredoka', system-ui, -apple-system, sans-serif" font-weight="800" font-size="24" fill="#0f172a">
      Fábrica y Distribuidora Alto Valle
    </text>
  </g>
</svg>`;

// 2. OFERTAS EN POLIETILENO Y EMBALAJE CON PRECIOS
const svg2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
  <defs>
    <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#fffaf5"/>
    </linearGradient>
    <filter id="shadow2" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity="0.2"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="600" height="750" fill="url(#bgGrad2)" rx="24"/>
  
  <!-- Top Header Title -->
  <g transform="translate(300, 75)" text-anchor="middle">
    <text font-family="'Fredoka', system-ui, -apple-system, sans-serif" font-weight="900" font-size="34" fill="#0f172a">
      OFERTAS EN
    </text>
    <text y="48" font-family="'Fredoka', system-ui, -apple-system, sans-serif" font-weight="900" font-size="44" fill="#f97316" stroke="#0f172a" stroke-width="3" paint-order="stroke fill">
      POLIETILENO
    </text>
    <text y="92" font-family="'Fredoka', system-ui, -apple-system, sans-serif" font-weight="900" font-size="40" fill="#0f172a">
      Y EMBALAJE
    </text>
  </g>

  <!-- Product 1: Bolsas Camiseta (Top Left) -->
  <g transform="translate(130, 240)">
    <!-- Bag Shape -->
    <path d="M -45 0 C -45 -10 -35 -20 -25 -20 C -15 -20 -15 -5 -15 0 L 15 0 C 15 -5 15 -20 25 -20 C 35 -20 45 -10 45 0 L 50 80 C 50 88 42 95 35 95 L -35 95 C -42 95 -50 88 -50 80 Z" fill="#ffffff" stroke="#0f172a" stroke-width="3" filter="url(#shadow2)"/>
    <path d="M -15 0 C -15 15 15 15 15 0" fill="none" stroke="#0f172a" stroke-width="3"/>
    
    <!-- Discount Badge -->
    <g transform="translate(45, 10)">
      <circle cx="0" cy="0" r="32" fill="#ea580c" stroke="#9a3412" stroke-width="2"/>
      <text y="-4" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="12" fill="#ffffff" text-anchor="middle">AHORRO</text>
      <text y="14" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="17" fill="#ffffff" text-anchor="middle">$3400</text>
    </g>

    <!-- Label & Price -->
    <text y="125" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="18" fill="#0f172a" text-anchor="middle">Bolsas Camiseta</text>
    <text y="145" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="18" fill="#0f172a" text-anchor="middle">Minorista</text>
    
    <!-- Price Pill -->
    <g transform="translate(0, 175)">
      <rect x="-95" y="-18" width="190" height="36" rx="18" fill="#ea580c"/>
      <text y="6" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="20" fill="#ffffff" text-anchor="middle">$3400 / $2900</text>
    </g>
  </g>

  <!-- Product 2: Big Bag (Top Right) -->
  <g transform="translate(440, 245)">
    <!-- Big Bag Body -->
    <path d="M -55 -15 L 55 -15 L 50 65 L -50 65 Z" fill="#ffffff" stroke="#0f172a" stroke-width="3" filter="url(#shadow2)"/>
    <!-- Handles -->
    <path d="M -45 -15 C -45 -40 -30 -40 -30 -15" fill="none" stroke="#0f172a" stroke-width="4"/>
    <path d="M 30 -15 C 30 -40 45 -40 45 -15" fill="none" stroke="#0f172a" stroke-width="4"/>
    <!-- Big Bag Print -->
    <text y="20" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="22" fill="#0f172a" text-anchor="middle">Big</text>
    <text y="42" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="22" fill="#0f172a" text-anchor="middle">Bag</text>
    
    <text x="-80" y="10" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="16" fill="#0f172a">H</text>
    <text x="-80" y="28" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="16" fill="#0f172a">Film</text>
  </g>

  <!-- Product 3: Film Stretch Manual (Bottom Right) -->
  <g transform="translate(430, 480)">
    <!-- Stretch Roll Perspective -->
    <g transform="rotate(-20)">
      <rect x="-65" y="-18" width="130" height="36" rx="8" fill="#f1f5f9" stroke="#0f172a" stroke-width="3" filter="url(#shadow2)"/>
      <ellipse cx="-65" cy="0" rx="10" ry="18" fill="#cbd5e1" stroke="#0f172a" stroke-width="2"/>
      <circle cx="-65" cy="0" r="5" fill="#78350f"/>
    </g>

    <!-- Discount Badge -->
    <g transform="translate(45, -20)">
      <circle cx="0" cy="0" r="32" fill="#ea580c" stroke="#9a3412" stroke-width="2"/>
      <text y="-4" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="12" fill="#ffffff" text-anchor="middle">AHORRO</text>
      <text y="14" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="17" fill="#ffffff" text-anchor="middle">$1900</text>
    </g>

    <!-- Label & Price -->
    <text y="65" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="18" fill="#0f172a" text-anchor="middle">Film Stretch Manual</text>
    
    <!-- Price Pill -->
    <g transform="translate(0, 95)">
      <rect x="-105" y="-18" width="210" height="36" rx="18" fill="#ea580c"/>
      <text y="6" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="20" fill="#ffffff" text-anchor="middle">$14800 / $12900</text>
    </g>
  </g>

  <!-- Bottom Left: Smiling Mascot with Big Bag -->
  <g transform="translate(110, 520)">
    <!-- Koala Mascot -->
    <g transform="scale(0.85)">
      <circle cx="-45" cy="-30" r="26" fill="#94a3b8"/>
      <circle cx="-45" cy="-30" r="16" fill="#fbcfe8"/>
      <circle cx="45" cy="-30" r="26" fill="#94a3b8"/>
      <circle cx="45" cy="-30" r="16" fill="#fbcfe8"/>
      <ellipse cx="0" cy="0" rx="45" ry="38" fill="#cbd5e1"/>
      <circle cx="-25" cy="10" r="8" fill="#f472b6" opacity="0.6"/>
      <circle cx="25" cy="10" r="8" fill="#f472b6" opacity="0.6"/>
      <ellipse cx="-16" cy="-5" rx="6" ry="8" fill="#0f172a"/>
      <circle cx="-14" cy="-8" r="2.5" fill="#ffffff"/>
      <ellipse cx="16" cy="-5" rx="6" ry="8" fill="#0f172a"/>
      <circle cx="18" cy="-8" r="2.5" fill="#ffffff"/>
      <ellipse cx="0" cy="2" rx="14" ry="18" fill="#475569"/>
      <path d="M -8 18 Q 0 26 8 18" fill="none" stroke="#0f172a" stroke-width="2.5"/>
      <path d="M -20 35 C -30 50 -25 80 0 80 C 25 80 30 50 20 35" fill="#94a3b8"/>
      <ellipse cx="0" cy="55" rx="16" ry="14" fill="#ffffff"/>
      <!-- Arm pointing right -->
      <path d="M 20 40 Q 55 35 65 30" fill="none" stroke="#94a3b8" stroke-width="12" stroke-linecap="round"/>
    </g>

    <!-- Mini Big Bag in hand -->
    <g transform="translate(85, 30)">
      <rect x="-25" y="-10" width="50" height="65" rx="6" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
      <path d="M -12 -10 C -12 -22 12 -22 12 -10" fill="none" stroke="#78350f" stroke-width="3"/>
      <text y="20" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="14" fill="#0f172a" text-anchor="middle">Big</text>
      <text y="36" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="14" fill="#0f172a" text-anchor="middle">Bag</text>
    </g>
  </g>

  <!-- Bottom Orange Footer Bar -->
  <rect x="0" y="715" width="600" height="35" fill="#ea580c"/>
</svg>`;

// 3. COTILLÓN, FINANCIACIÓN Y MÁS (CON BPN)
const svg3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
  <defs>
    <linearGradient id="bgGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#fffaf5"/>
    </linearGradient>
    <filter id="shadow3" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity="0.18"/>
    </filter>
  </defs>

  <rect width="600" height="750" fill="url(#bgGrad3)" rx="24"/>

  <!-- Top Title -->
  <g transform="translate(300, 75)" text-anchor="middle">
    <text font-family="'Fredoka', system-ui, -apple-system, sans-serif" font-weight="900" font-size="44" fill="#f97316" stroke="#0f172a" stroke-width="3" paint-order="stroke fill">
      COTILLÓN,
    </text>
    <text y="50" font-family="'Fredoka', system-ui, -apple-system, sans-serif" font-weight="900" font-size="44" fill="#f97316" stroke="#0f172a" stroke-width="3" paint-order="stroke fill">
      FINANCIACIÓN
    </text>
    <text y="95" font-family="'Fredoka', system-ui, -apple-system, sans-serif" font-weight="900" font-size="40" fill="#0f172a">
      Y MÁS
    </text>
  </g>

  <!-- Left: Balloons Bundle -->
  <g transform="translate(160, 245)">
    <g transform="translate(0, 0)">
      <ellipse cx="-40" cy="-20" rx="20" ry="26" fill="#f87171"/>
      <ellipse cx="-20" cy="-45" rx="22" ry="28" fill="#86efac"/>
      <ellipse cx="20" cy="-45" rx="22" ry="28" fill="#fef08a"/>
      <ellipse cx="40" cy="-20" rx="20" ry="26" fill="#67e8f9"/>
      <ellipse cx="-20" cy="5" rx="22" ry="28" fill="#f472b6"/>
      <ellipse cx="20" cy="5" rx="22" ry="28" fill="#d8b4fe"/>
      <ellipse cx="0" cy="-15" rx="20" ry="26" fill="#c084fc"/>
      <ellipse cx="30" cy="20" rx="18" ry="24" fill="#fcd34d"/>
      <ellipse cx="-35" cy="15" rx="18" ry="24" fill="#a5f3fc"/>
      <!-- Strings -->
      <path d="M 0 30 L 0 80 M -20 30 L 0 80 M 20 30 L 0 80 M -35 30 L 0 80 M 35 30 L 0 80" stroke="#94a3b8" stroke-width="1.5"/>
    </g>

    <!-- Label -->
    <text y="105" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="18" fill="#0f172a" text-anchor="middle">Pasteles,</text>
    <text y="125" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="18" fill="#0f172a" text-anchor="middle">metalizados</text>

    <!-- Price Pill -->
    <g transform="translate(0, 155)">
      <rect x="-95" y="-18" width="190" height="36" rx="18" fill="#ea580c"/>
      <text y="6" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="20" fill="#ffffff" text-anchor="middle">$3400 / $21900</text>
    </g>
  </g>

  <!-- Right: Metallic Shimmer Rain Curtain -->
  <g transform="translate(440, 245)">
    <!-- Curtain Striped Box -->
    <g transform="translate(0, 0)">
      <rect x="-65" y="-55" width="130" height="105" rx="4" fill="#cbd5e1" stroke="#0f172a" stroke-width="2" filter="url(#shadow3)"/>
      <rect x="-65" y="-55" width="32" height="105" fill="#e879f9"/>
      <rect x="-33" y="-55" width="32" height="105" fill="#38bdf8"/>
      <rect x="-1" y="-55" width="32" height="105" fill="#facc15"/>
      <rect x="31" y="-55" width="34" height="105" fill="#ef4444"/>
      <!-- Top hanger -->
      <rect x="-67" y="-58" width="134" height="8" fill="#475569"/>
    </g>

    <!-- Discount Badge -->
    <g transform="translate(45, 0)">
      <circle cx="0" cy="0" r="32" fill="#ea580c" stroke="#9a3412" stroke-width="2"/>
      <text y="-4" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="12" fill="#ffffff" text-anchor="middle">AHORRO</text>
      <text y="14" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="17" fill="#ffffff" text-anchor="middle">$5400</text>
    </g>

    <!-- Label -->
    <text y="75" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="18" fill="#0f172a" text-anchor="middle">Cortina</text>
    <text y="95" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="18" fill="#0f172a" text-anchor="middle">Metalizada Lluvia</text>

    <!-- Price Pill -->
    <g transform="translate(0, 125)">
      <rect x="-105" y="-18" width="210" height="36" rx="18" fill="#ea580c"/>
      <text y="6" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="20" fill="#ffffff" text-anchor="middle">$14800 / $12900</text>
    </g>
  </g>

  <!-- Bottom Left: Happy Dancing Mascot -->
  <g transform="translate(130, 545)">
    <circle cx="-42" cy="-30" r="25" fill="#94a3b8"/>
    <circle cx="-42" cy="-30" r="15" fill="#fbcfe8"/>
    <circle cx="42" cy="-30" r="25" fill="#94a3b8"/>
    <circle cx="42" cy="-30" r="15" fill="#fbcfe8"/>
    <ellipse cx="0" cy="0" rx="44" ry="38" fill="#cbd5e1"/>
    <circle cx="-25" cy="10" r="8" fill="#f472b6" opacity="0.6"/>
    <circle cx="25" cy="10" r="8" fill="#f472b6" opacity="0.6"/>
    <ellipse cx="-16" cy="-5" rx="6" ry="8" fill="#0f172a"/>
    <circle cx="-14" cy="-8" r="2.5" fill="#ffffff"/>
    <ellipse cx="16" cy="-5" rx="6" ry="8" fill="#0f172a"/>
    <circle cx="18" cy="-8" r="2.5" fill="#ffffff"/>
    <ellipse cx="0" cy="2" rx="14" ry="18" fill="#475569"/>
    <path d="M -10 18 Q 0 28 10 18" fill="none" stroke="#0f172a" stroke-width="2.5"/>
    <path d="M -20 35 C -30 50 -25 80 0 80 C 25 80 30 50 20 35" fill="#94a3b8"/>
    <ellipse cx="0" cy="55" rx="16" ry="14" fill="#ffffff"/>
    <!-- Joyful hands -->
    <path d="M -30 40 Q -60 20 -50 0" fill="none" stroke="#94a3b8" stroke-width="12" stroke-linecap="round"/>
    <path d="M 30 40 Q 60 20 50 0" fill="none" stroke="#94a3b8" stroke-width="12" stroke-linecap="round"/>
    <!-- Dancing feet -->
    <ellipse cx="-15" cy="85" rx="12" ry="8" fill="#94a3b8"/>
    <ellipse cx="20" cy="80" rx="12" ry="8" fill="#94a3b8"/>
  </g>

  <!-- Bottom Right: BPN Financing Card -->
  <g transform="translate(420, 560)">
    <rect x="-140" y="-70" width="280" height="135" rx="20" fill="#0284c7" filter="url(#shadow3)"/>
    
    <!-- BPN Tree Icon & Name -->
    <g transform="translate(-75, -25)">
      <circle cx="0" cy="0" r="22" fill="#ffffff"/>
      <!-- Stylized Tree (Araucaria BPN) -->
      <path d="M 0 12 L 0 -12 M -10 -4 L 0 -12 L 10 -4 M -12 4 L 0 -8 L 12 4" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round"/>
    </g>
    <text x="-35" y="-12" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="34" fill="#ffffff">BPN</text>
    <text x="-35" y="4" font-family="'Fredoka', system-ui, sans-serif" font-weight="600" font-size="9" fill="#e0f2fe">Banco Provincia del Neuquén</text>

    <!-- Cuotas Text -->
    <text y="32" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="18" fill="#ffffff" text-anchor="middle">
      3 y 6 Cuotas sin Interés
    </text>
    <text y="52" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="18" fill="#ffffff" text-anchor="middle">
      con BPN
    </text>
  </g>

  <!-- Bottom Orange Footer Bar -->
  <rect x="0" y="715" width="600" height="35" fill="#ea580c"/>
</svg>`;

// 4. HACÉ TU PEDIDO POR WHATSAPP Y VISITANOS
const svg4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
  <defs>
    <linearGradient id="bgGrad4" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#fffaf5"/>
    </linearGradient>
    <filter id="shadow4" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity="0.18"/>
    </filter>
  </defs>

  <rect width="600" height="750" fill="url(#bgGrad4)" rx="24"/>

  <!-- Top Title -->
  <g transform="translate(300, 65)" text-anchor="middle">
    <text font-family="'Fredoka', system-ui, -apple-system, sans-serif" font-weight="900" font-size="36" fill="#0f172a">
      HACÉ TU PEDIDO POR
    </text>
    <text y="44" font-family="'Fredoka', system-ui, -apple-system, sans-serif" font-weight="900" font-size="34" fill="#0f172a">
      WHATSAPP Y VISITANOS
    </text>
  </g>

  <!-- Brand with Cute Mini Mascot -->
  <g transform="translate(300, 185)" text-anchor="middle">
    <text font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="52" fill="#ea580c" stroke="#9a3412" stroke-width="2">
      Koala
    </text>
    <!-- Mini Koala Head on the Top -->
    <g transform="translate(70, -42) scale(0.4)">
      <circle cx="-25" cy="-15" r="16" fill="#94a3b8"/>
      <circle cx="25" cy="-15" r="16" fill="#94a3b8"/>
      <ellipse cx="0" cy="0" rx="30" ry="24" fill="#cbd5e1"/>
      <circle cx="-12" cy="-4" r="4" fill="#0f172a"/>
      <circle cx="12" cy="-4" r="4" fill="#0f172a"/>
      <ellipse cx="0" cy="2" rx="10" ry="12" fill="#475569"/>
    </g>
    <text y="38" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="32" fill="#0f172a">
      Lo tiene!
    </text>
  </g>

  <!-- Location Pins & Details -->
  <g transform="translate(0, 275)">
    <!-- Branch 1: General Roca -->
    <g transform="translate(160, 0)">
      <!-- Map Pin Circle -->
      <g transform="translate(0, 0)">
        <circle cx="0" cy="0" r="26" fill="#f97316" stroke="#0f172a" stroke-width="3"/>
        <circle cx="0" cy="0" r="9" fill="#ffffff"/>
      </g>
      <text y="50" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="20" fill="#0f172a" text-anchor="middle">
        GRAL ROCA
      </text>
      <text y="70" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="16" fill="#0f172a" text-anchor="middle">
        (CASA CENTRAL)
      </text>
      <text y="92" font-family="'Fredoka', system-ui, sans-serif" font-weight="700" font-size="16" fill="#334155" text-anchor="middle">
        Av. Roca 1350
      </text>
    </g>

    <!-- Branch 2: Neuquén Capital -->
    <g transform="translate(440, 0)">
      <!-- Map Pin Circle -->
      <g transform="translate(0, 0)">
        <circle cx="0" cy="0" r="26" fill="#f97316" stroke="#0f172a" stroke-width="3"/>
        <circle cx="0" cy="0" r="9" fill="#ffffff"/>
      </g>
      <text y="50" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="20" fill="#0f172a" text-anchor="middle">
        NEUQUÉN
      </text>
      <text y="70" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="18" fill="#0f172a" text-anchor="middle">
        CAPITAL
      </text>
      <text y="92" font-family="'Fredoka', system-ui, sans-serif" font-weight="700" font-size="16" fill="#334155" text-anchor="middle">
        Mitre 678
      </text>
    </g>
  </g>

  <!-- WhatsApp Contacts Section -->
  <g transform="translate(0, 420)">
    <!-- WhatsApp Roca -->
    <g transform="translate(160, 0)">
      <g transform="translate(-100, 0)">
        <circle cx="0" cy="0" r="18" fill="#22c55e"/>
        <path d="M -6 4 C 0 8 4 6 7 2 L 5 0 C 4 1 3 1 2 0 C 1 -1 1 -2 2 -3 L 0 -5 C -4 -2 -2 2 -6 4 Z" fill="#ffffff"/>
      </g>
      <text x="-70" y="-8" font-family="'Fredoka', system-ui, sans-serif" font-weight="700" font-size="14" fill="#0f172a">WhatsApp General Roca:</text>
      <text x="-70" y="16" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="22" fill="#0f172a">298 453-6376</text>
    </g>

    <!-- WhatsApp Neuquén -->
    <g transform="translate(440, 0)">
      <g transform="translate(-95, 0)">
        <circle cx="0" cy="0" r="18" fill="#22c55e"/>
        <path d="M -6 4 C 0 8 4 6 7 2 L 5 0 C 4 1 3 1 2 0 C 1 -1 1 -2 2 -3 L 0 -5 C -4 -2 -2 2 -6 4 Z" fill="#ffffff"/>
      </g>
      <text x="-65" y="-8" font-family="'Fredoka', system-ui, sans-serif" font-weight="700" font-size="14" fill="#0f172a">WhatsApp Nqn:</text>
      <text x="-65" y="16" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="22" fill="#0f172a">299 509-3911</text>
    </g>
  </g>

  <!-- Center BPN Badge -->
  <g transform="translate(240, 510)">
    <circle cx="0" cy="0" r="25" fill="#0284c7"/>
    <path d="M 0 14 L 0 -14 M -12 -5 L 0 -14 L 12 -5 M -14 5 L 0 -9 L 14 5" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
    <text x="35" y="10" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="38" fill="#0284c7">BPN</text>
  </g>

  <!-- Mascot with Phone (Bottom Right) -->
  <g transform="translate(490, 560)">
    <circle cx="-35" cy="-25" r="22" fill="#94a3b8"/>
    <circle cx="-35" cy="-25" r="14" fill="#fbcfe8"/>
    <circle cx="35" cy="-25" r="22" fill="#94a3b8"/>
    <circle cx="35" cy="-25" r="14" fill="#fbcfe8"/>
    <ellipse cx="0" cy="0" rx="38" ry="32" fill="#cbd5e1"/>
    <circle cx="-20" cy="8" r="6" fill="#f472b6" opacity="0.6"/>
    <circle cx="20" cy="8" r="6" fill="#f472b6" opacity="0.6"/>
    <ellipse cx="-14" cy="-4" rx="5" ry="7" fill="#0f172a"/>
    <circle cx="-12" cy="-6" r="2" fill="#ffffff"/>
    <ellipse cx="14" cy="-4" rx="5" ry="7" fill="#0f172a"/>
    <circle cx="16" cy="-6" r="2" fill="#ffffff"/>
    <ellipse cx="0" cy="2" rx="12" ry="15" fill="#475569"/>
    <path d="M -8 15 Q 0 22 8 15" fill="none" stroke="#0f172a" stroke-width="2"/>
    <path d="M -15 30 C -25 45 -20 70 0 70 C 20 70 25 45 15 30" fill="#94a3b8"/>
    <!-- Phone in Hand -->
    <g transform="translate(-40, 20)">
      <rect x="-14" y="-24" width="28" height="48" rx="6" fill="#0f172a"/>
      <rect x="-11" y="-20" width="22" height="40" rx="4" fill="#22c55e"/>
    </g>
  </g>

  <!-- Huge Orange CTA Button: HACÉ TU PEDIDO POR WHATSAPP -->
  <g transform="translate(300, 680)">
    <rect x="-260" y="-35" width="520" height="70" rx="35" fill="#ea580c" stroke="#9a3412" stroke-width="2" filter="url(#shadow4)"/>
    <text y="-4" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="28" fill="#ffffff" text-anchor="middle">
      HACÉ TU PEDIDO
    </text>
    <text y="24" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="28" fill="#ffffff" text-anchor="middle">
      POR WHATSAPP
    </text>
  </g>
</svg>`;

// 5. VISITANOS O HACÉ TU PEDIDO (MAPA REGIONAL CON FOTOS)
const svg5 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
  <defs>
    <linearGradient id="bgGrad5" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
    <filter id="shadow5" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity="0.18"/>
    </filter>
  </defs>

  <rect width="600" height="750" fill="url(#bgGrad5)" rx="24"/>

  <!-- Top Display Title -->
  <g transform="translate(300, 70)" text-anchor="middle">
    <text font-family="'Fredoka', system-ui, -apple-system, sans-serif" font-weight="900" font-size="44" fill="#ea580c" stroke="#0f172a" stroke-width="3" paint-order="stroke fill">
      VISITANOS O
    </text>
    <text y="50" font-family="'Fredoka', system-ui, -apple-system, sans-serif" font-weight="900" font-size="42" fill="#0f172a">
      HACÉ TU PEDIDO
    </text>
  </g>

  <!-- Regional River Map Outline -->
  <g transform="translate(50, 160)">
    <!-- Light Map Boundary -->
    <path d="M 50 20 C 120 15 280 25 450 15 L 470 180 C 350 190 200 170 30 180 Z" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
    <!-- River Negro / Limay Path -->
    <path d="M 60 140 C 140 120 180 80 250 85 C 320 90 380 130 460 125" fill="none" stroke="#93c5fd" stroke-width="6" stroke-linecap="round"/>
    <path d="M 120 115 C 160 95 190 85 240 85" fill="none" stroke="#60a5fa" stroke-width="3"/>
  </g>

  <!-- Branch 1: General Roca (Left) -->
  <g transform="translate(160, 230)">
    <!-- Photo Storefront Frame in Circle -->
    <g filter="url(#shadow5)">
      <circle cx="0" cy="0" r="52" fill="#ea580c"/>
      <circle cx="0" cy="0" r="46" fill="#334155"/>
      <!-- Store front building illustration -->
      <rect x="-35" y="-20" width="70" height="40" fill="#e2e8f0"/>
      <rect x="-35" y="-28" width="70" height="12" fill="#ea580c"/>
      <text y="-20" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="9" fill="#ffffff" text-anchor="middle">KOALA ROCA</text>
      <!-- Glass windows & door -->
      <rect x="-28" y="-5" width="22" height="24" fill="#0284c7" opacity="0.6"/>
      <rect x="6" y="-5" width="22" height="24" fill="#0284c7" opacity="0.6"/>
    </g>

    <!-- Location Pin -->
    <g transform="translate(55, 35)">
      <path d="M 0 0 C -12 0 -18 8 -18 18 C -18 28 0 45 0 45 C 0 45 18 28 18 18 C 18 8 12 0 0 0 Z" fill="#ea580c" stroke="#0f172a" stroke-width="2"/>
      <circle cx="0" cy="18" r="6" fill="#ffffff"/>
    </g>

    <!-- Text -->
    <text y="75" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="22" fill="#0f172a" text-anchor="middle">Gral Roca</text>
    <text y="95" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="16" fill="#0f172a" text-anchor="middle">(CASA CENTRAL)</text>
    <text y="116" font-family="'Fredoka', system-ui, sans-serif" font-weight="700" font-size="16" fill="#334155" text-anchor="middle">Av. Roca 1350</text>
  </g>

  <!-- Branch 2: Neuquén Capital (Right) -->
  <g transform="translate(440, 230)">
    <!-- Photo Storefront Frame in Circle -->
    <g filter="url(#shadow5)">
      <circle cx="0" cy="0" r="52" fill="#ea580c"/>
      <circle cx="0" cy="0" r="46" fill="#334155"/>
      <!-- Store front building illustration -->
      <rect x="-35" y="-20" width="70" height="40" fill="#e2e8f0"/>
      <rect x="-35" y="-28" width="70" height="12" fill="#0f172a"/>
      <text y="-20" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="9" fill="#ffffff" text-anchor="middle">NEUQUÉN MITRE</text>
      <!-- Glass windows & entrance -->
      <rect x="-28" y="-5" width="56" height="24" fill="#0284c7" opacity="0.6"/>
    </g>

    <!-- Location Pin -->
    <g transform="translate(-55, 35)">
      <path d="M 0 0 C -12 0 -18 8 -18 18 C -18 28 0 45 0 45 C 0 45 18 28 18 18 C 18 8 12 0 0 0 Z" fill="#ea580c" stroke="#0f172a" stroke-width="2"/>
      <circle cx="0" cy="18" r="6" fill="#ffffff"/>
    </g>

    <!-- Text -->
    <text y="75" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="22" fill="#0f172a" text-anchor="middle">NEUQUÉN</text>
    <text y="95" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="18" fill="#0f172a" text-anchor="middle">CAPITAL</text>
    <text y="116" font-family="'Fredoka', system-ui, sans-serif" font-weight="700" font-size="16" fill="#334155" text-anchor="middle">Mitre 678</text>
  </g>

  <!-- WhatsApp Numbers -->
  <g transform="translate(60, 420)">
    <!-- Roca WhatsApp -->
    <g transform="translate(0, 0)">
      <circle cx="20" cy="15" r="16" fill="#ea580c"/>
      <path d="M 15 19 C 20 22 23 20 25 17 L 23 15 C 22 16 21 16 20 15 C 19 14 19 13 20 12 L 18 10 C 15 13 17 17 13 19 Z" fill="#ffffff"/>
      <text x="50" y="8" font-family="'Fredoka', system-ui, sans-serif" font-weight="700" font-size="14" fill="#0f172a">WhatsApp</text>
      <text x="50" y="26" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="20" fill="#0f172a">Roca: 298 453-6376</text>
    </g>

    <!-- Neuquén WhatsApp -->
    <g transform="translate(0, 50)">
      <circle cx="20" cy="15" r="16" fill="#ea580c"/>
      <path d="M 15 19 C 20 22 23 20 25 17 L 23 15 C 22 16 21 16 20 15 C 19 14 19 13 20 12 L 18 10 C 15 13 17 17 13 19 Z" fill="#ffffff"/>
      <text x="50" y="26" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="20" fill="#0f172a">Nqn: 299 509-3911</text>
    </g>
  </g>

  <!-- Action Badges -->
  <g transform="translate(40, 560)">
    <!-- 1. ENVIANOS WHATSAPP -->
    <rect x="0" y="0" width="280" height="42" rx="21" fill="#0f172a"/>
    <text x="140" y="27" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="17" fill="#ffffff" text-anchor="middle">ENVIANOS WHATSAPP</text>

    <!-- 2. SEGUINOS EN IG @KOALALOTIENE -->
    <rect x="0" y="52" width="310" height="48" rx="24" fill="#ea580c" stroke="#0f172a" stroke-width="2"/>
    <text x="155" y="74" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="14" fill="#ffffff" text-anchor="middle">SEGUINOS EN IG</text>
    <text x="155" y="91" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="16" fill="#ffffff" text-anchor="middle">@KOALALOTIENE</text>

    <!-- 3. SUMÁ PUNTOS CLUB KOALA -->
    <rect x="0" y="112" width="280" height="38" rx="19" fill="#0f172a"/>
    <text x="140" y="136" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="15" fill="#ffffff" text-anchor="middle">SUMÁ PUNTOS CLUB KOALA</text>
  </g>

  <!-- Happy Waving Koala Mascot (Right) -->
  <g transform="translate(470, 580)">
    <circle cx="-45" cy="-35" r="28" fill="#94a3b8"/>
    <circle cx="-45" cy="-35" r="18" fill="#fbcfe8"/>
    <circle cx="45" cy="-35" r="28" fill="#94a3b8"/>
    <circle cx="45" cy="-35" r="18" fill="#fbcfe8"/>
    <ellipse cx="0" cy="0" rx="50" ry="42" fill="#cbd5e1"/>
    <circle cx="-28" cy="12" r="9" fill="#f472b6" opacity="0.6"/>
    <circle cx="28" cy="12" r="9" fill="#f472b6" opacity="0.6"/>
    <ellipse cx="-18" cy="-6" rx="7" ry="9" fill="#0f172a"/>
    <circle cx="-16" cy="-9" r="3" fill="#ffffff"/>
    <ellipse cx="18" cy="-6" rx="7" ry="9" fill="#0f172a"/>
    <circle cx="20" cy="-9" r="3" fill="#ffffff"/>
    <ellipse cx="0" cy="4" rx="16" ry="20" fill="#475569"/>
    <path d="M -12 20 Q 0 32 12 20" fill="none" stroke="#0f172a" stroke-width="3"/>
    <path d="M -25 40 C -35 55 -30 85 0 85 C 30 85 35 55 25 40" fill="#94a3b8"/>
    <ellipse cx="0" cy="62" rx="18" ry="16" fill="#ffffff"/>
    <!-- Waving Arms -->
    <path d="M -30 45 Q -65 25 -55 5" fill="none" stroke="#94a3b8" stroke-width="14" stroke-linecap="round"/>
    <path d="M 30 45 Q 65 25 55 5" fill="none" stroke="#94a3b8" stroke-width="14" stroke-linecap="round"/>
  </g>
</svg>`;

// 6. MEGA OFERTAS EN TIENDA / PASILLO
const svg6 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
  <defs>
    <linearGradient id="bgStore" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff7ed"/>
      <stop offset="100%" stop-color="#fed7aa"/>
    </linearGradient>
    <filter id="shadow6" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.25"/>
    </filter>
  </defs>

  <rect width="600" height="750" fill="url(#bgStore)" rx="24"/>

  <!-- Warehouse / Retail Shelves Background Elements -->
  <g opacity="0.35">
    <!-- Left Shelves with Rolls & Jars -->
    <rect x="20" y="100" width="100" height="500" fill="#cbd5e1"/>
    <line x1="20" y1="180" x2="120" y2="180" stroke="#475569" stroke-width="6"/>
    <line x1="20" y1="280" x2="120" y2="280" stroke="#475569" stroke-width="6"/>
    <line x1="20" y1="380" x2="120" y2="380" stroke="#475569" stroke-width="6"/>
    <line x1="20" y1="480" x2="120" y2="480" stroke="#475569" stroke-width="6"/>
    
    <!-- Right Shelves with Boxes & Rolls -->
    <rect x="480" y="100" width="100" height="500" fill="#cbd5e1"/>
    <line x1="480" y1="180" x2="580" y2="180" stroke="#475569" stroke-width="6"/>
    <line x1="480" y1="280" x2="580" y2="280" stroke="#475569" stroke-width="6"/>
    <line x1="480" y1="380" x2="580" y2="380" stroke="#475569" stroke-width="6"/>
    <line x1="480" y1="480" x2="580" y2="480" stroke="#475569" stroke-width="6"/>
    
    <!-- Overhead Lights & Streamers -->
    <path d="M 0 60 Q 150 100 300 60 Q 450 100 600 60" stroke="#f43f5e" stroke-width="4" fill="none"/>
    <path d="M 0 90 Q 200 130 400 90 Q 500 120 600 80" stroke="#0ea5e9" stroke-width="4" fill="none"/>
  </g>

  <!-- Big Arched Title: MEGA OFERTAS! -->
  <g transform="translate(300, 110)" text-anchor="middle">
    <text font-family="'Fredoka', system-ui, -apple-system, sans-serif" font-weight="900" font-size="64" fill="#ea580c" stroke="#0f172a" stroke-width="6" paint-order="stroke fill" letter-spacing="1">
      MEGA
    </text>
    <text y="70" font-family="'Fredoka', system-ui, -apple-system, sans-serif" font-weight="900" font-size="64" fill="#ea580c" stroke="#0f172a" stroke-width="6" paint-order="stroke fill" letter-spacing="1">
      OFERTAS!
    </text>
  </g>

  <!-- Big Happy Koala in Center of Aisle -->
  <g transform="translate(300, 360)">
    <!-- Ears -->
    <circle cx="-85" cy="-45" r="44" fill="#94a3b8"/>
    <circle cx="-85" cy="-45" r="28" fill="#fbcfe8"/>
    <circle cx="85" cy="-45" r="44" fill="#94a3b8"/>
    <circle cx="85" cy="-45" r="28" fill="#fbcfe8"/>
    <!-- Head -->
    <ellipse cx="0" cy="0" rx="80" ry="68" fill="#cbd5e1" filter="url(#shadow6)"/>
    <!-- Cheeks -->
    <circle cx="-45" cy="18" r="14" fill="#f472b6" opacity="0.6"/>
    <circle cx="45" cy="18" r="14" fill="#f472b6" opacity="0.6"/>
    <!-- Big Bright Eyes -->
    <ellipse cx="-30" cy="-8" rx="11" ry="15" fill="#0f172a"/>
    <circle cx="-26" cy="-12" r="4.5" fill="#ffffff"/>
    <ellipse cx="30" cy="-8" rx="11" ry="15" fill="#0f172a"/>
    <circle cx="34" cy="-12" r="4.5" fill="#ffffff"/>
    <!-- Big Nose -->
    <ellipse cx="0" cy="6" rx="24" ry="30" fill="#475569"/>
    <!-- Big Open Smile -->
    <path d="M -18 30 Q 0 50 18 30 Z" fill="#991b1b" stroke="#0f172a" stroke-width="3"/>
    <path d="M -8 44 Q 0 48 8 44" fill="#f87171"/>
    
    <!-- Body -->
    <path d="M -40 60 C -55 85 -50 130 0 130 C 50 130 55 85 40 60" fill="#94a3b8"/>
    <ellipse cx="0" cy="95" rx="28" ry="24" fill="#ffffff"/>
    <!-- Wide Open Welcoming Arms -->
    <path d="M -45 70 Q -110 50 -100 10" fill="none" stroke="#94a3b8" stroke-width="20" stroke-linecap="round"/>
    <path d="M 45 70 Q 110 50 100 10" fill="none" stroke="#94a3b8" stroke-width="20" stroke-linecap="round"/>
  </g>

  <!-- Left / Right Info Pills -->
  <g transform="translate(100, 480)">
    <rect x="-80" y="-30" width="160" height="60" rx="30" fill="#ffffff" stroke="#0f172a" stroke-width="2" filter="url(#shadow6)"/>
    <text y="-8" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="13" fill="#0f172a" text-anchor="middle">Alto Valle</text>
    <text y="8" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="12" fill="#0f172a" text-anchor="middle">Fábrica &amp;</text>
    <text y="22" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="12" fill="#0f172a" text-anchor="middle">Distribuidora</text>
  </g>

  <g transform="translate(500, 480)">
    <rect x="-80" y="-30" width="160" height="60" rx="30" fill="#ffffff" stroke="#0f172a" stroke-width="2" filter="url(#shadow6)"/>
    <text y="-8" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="13" fill="#0f172a" text-anchor="middle">General Roca</text>
    <text y="8" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="12" fill="#0f172a" text-anchor="middle">&amp; Neuquén</text>
    <text y="22" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="12" fill="#0f172a" text-anchor="middle">Capital</text>
  </g>

  <!-- Brand Signature -->
  <g transform="translate(300, 585)" text-anchor="middle">
    <text font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="64" fill="#ea580c" stroke="#0f172a" stroke-width="4" paint-order="stroke fill">
      Koala
    </text>
    <text y="48" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="44" fill="#0f172a">
      Lo tiene!
    </text>
  </g>

  <!-- Bottom Strip Banner -->
  <g transform="translate(300, 715)">
    <rect x="-260" y="-22" width="520" height="44" rx="22" fill="#ffffff" stroke="#ea580c" stroke-width="2"/>
    <text y="8" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="20" fill="#0f172a" text-anchor="middle">
      Todo para tu comercio y tus eventos.
    </text>
  </g>
</svg>`;

// 7. OFERTAS EN POLIETILENO Y EMBALAJE (KOALA CON CASCO)
const svg7 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
  <defs>
    <linearGradient id="bgGrad7" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff7ed"/>
      <stop offset="100%" stop-color="#ffedd5"/>
    </linearGradient>
    <filter id="shadow7" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity="0.18"/>
    </filter>
  </defs>

  <rect width="600" height="750" fill="url(#bgGrad7)" rx="24"/>

  <!-- Top Headline Title -->
  <g transform="translate(300, 75)" text-anchor="middle">
    <text font-family="'Fredoka', system-ui, -apple-system, sans-serif" font-weight="900" font-size="40" fill="#f97316" stroke="#0f172a" stroke-width="3" paint-order="stroke fill">
      OFERTAS EN
    </text>
    <text y="48" font-family="'Fredoka', system-ui, -apple-system, sans-serif" font-weight="900" font-size="44" fill="#f97316" stroke="#0f172a" stroke-width="3" paint-order="stroke fill">
      POLIETILENO
    </text>
    <text y="92" font-family="'Fredoka', system-ui, -apple-system, sans-serif" font-weight="900" font-size="42" fill="#f97316" stroke="#0f172a" stroke-width="3" paint-order="stroke fill">
      Y EMBALAJE
    </text>
  </g>

  <!-- Subtitle: Ahorro hasta X%! -->
  <g transform="translate(300, 210)" text-anchor="middle">
    <text font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="34" fill="#0f172a">
      ¡Ahorro hasta 17%!
    </text>
    <text y="32" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="20" fill="#334155">
      Precios Minorista &amp; Mayorista
    </text>
    <text y="58" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="20" fill="#334155">
      (Bulto cerrado)
    </text>
  </g>

  <!-- Center Mascot with Orange Builder Safety Helmet Taping Boxes -->
  <g transform="translate(300, 395)">
    <!-- Ears -->
    <circle cx="-65" cy="-35" r="34" fill="#94a3b8"/>
    <circle cx="-65" cy="-35" r="22" fill="#fbcfe8"/>
    <circle cx="65" cy="-35" r="34" fill="#94a3b8"/>
    <circle cx="65" cy="-35" r="22" fill="#fbcfe8"/>
    <!-- Head -->
    <ellipse cx="0" cy="0" rx="60" ry="50" fill="#cbd5e1"/>
    <!-- Cheeks -->
    <circle cx="-35" cy="12" r="10" fill="#f472b6" opacity="0.6"/>
    <circle cx="35" cy="12" r="10" fill="#f472b6" opacity="0.6"/>
    <!-- Eyes -->
    <ellipse cx="-22" cy="-6" rx="8" ry="11" fill="#0f172a"/>
    <circle cx="-20" cy="-9" r="3.5" fill="#ffffff"/>
    <ellipse cx="22" cy="-6" rx="8" ry="11" fill="#0f172a"/>
    <circle cx="24" cy="-9" r="3.5" fill="#ffffff"/>
    <!-- Nose -->
    <ellipse cx="0" cy="4" rx="18" ry="24" fill="#475569"/>
    <!-- Smile -->
    <path d="M -12 24 Q 0 34 12 24" fill="none" stroke="#0f172a" stroke-width="3"/>
    
    <!-- Orange Construction Hard Hat -->
    <path d="M -60 -15 C -60 -55 60 -55 60 -15 Z" fill="#ea580c" stroke="#0f172a" stroke-width="3"/>
    <rect x="-66" y="-18" width="132" height="10" rx="5" fill="#ea580c" stroke="#0f172a" stroke-width="2"/>
    <path d="M -12 -55 L -12 -18 M 12 -55 L 12 -18" stroke="#c2410c" stroke-width="3"/>

    <!-- Body Sitting -->
    <path d="M -35 45 C -50 65 -40 100 0 100 C 40 100 50 65 35 45" fill="#94a3b8"/>
    <ellipse cx="0" cy="72" rx="22" ry="20" fill="#ffffff"/>

    <!-- Cardboard Box in Front -->
    <g transform="translate(0, 75)">
      <rect x="-45" y="-20" width="90" height="45" rx="4" fill="#d97706" stroke="#78350f" stroke-width="2.5" filter="url(#shadow7)"/>
      <rect x="-45" y="-20" width="90" height="12" fill="#b45309"/>
      <!-- Tape on Box -->
      <line x1="-45" y1="-5" x2="45" y2="-5" stroke="#fef08a" stroke-width="6"/>
      <!-- Mascot Hands on Box -->
      <circle cx="-25" cy="-18" r="10" fill="#94a3b8"/>
      <circle cx="25" cy="-18" r="10" fill="#94a3b8"/>
    </g>

    <!-- Side Paper & Packing Materials -->
    <g transform="translate(-130, 40)">
      <rect x="-25" y="-15" width="50" height="65" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
      <line x1="-15" y1="5" x2="15" y2="5" stroke="#94a3b8" stroke-width="2"/>
      <line x1="-15" y1="18" x2="15" y2="18" stroke="#94a3b8" stroke-width="2"/>
    </g>
    <g transform="translate(130, 40)">
      <rect x="-25" y="-15" width="50" height="65" rx="4" fill="#d97706" stroke="#78350f" stroke-width="2"/>
      <path d="M -25 -15 L 0 -35 L 25 -15 Z" fill="#b45309"/>
    </g>
  </g>

  <!-- Product Categories Triad at Bottom -->
  <g transform="translate(0, 600)">
    <!-- 1. Bags Directo de Fábrica -->
    <g transform="translate(120, 0)">
      <path d="M -25 -25 L 25 -25 L 30 30 L -30 30 Z" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
      <ellipse cx="0" cy="-12" rx="10" ry="4" fill="#0f172a"/>
      <text y="50" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="16" fill="#0f172a" text-anchor="middle">Bags</text>
      <text y="70" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="13" fill="#ea580c" text-anchor="middle">Directo</text>
      <text y="86" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="13" fill="#ea580c" text-anchor="middle">de Fábrica</text>
    </g>

    <!-- 2. Film Stretch Rolls -->
    <g transform="translate(300, 0)">
      <rect x="-20" y="-30" width="40" height="55" rx="6" fill="#f1f5f9" stroke="#0f172a" stroke-width="2"/>
      <ellipse cx="0" cy="-30" rx="20" ry="7" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
      <text y="50" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="16" fill="#0f172a" text-anchor="middle">Film stretch</text>
      <text y="70" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="14" fill="#334155" text-anchor="middle">Rolls</text>
    </g>

    <!-- 3. Big Bags Consultas Mayoristas -->
    <g transform="translate(480, 0)">
      <rect x="-28" y="-20" width="56" height="50" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
      <path d="M -20 -20 C -20 -32 -10 -32 -10 -20 M 10 -20 C 10 -32 20 -32 20 -20" fill="none" stroke="#0f172a" stroke-width="2.5"/>
      <text y="50" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="16" fill="#0f172a" text-anchor="middle">Big bags</text>
      <text y="70" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="13" fill="#ea580c" text-anchor="middle">Consultas</text>
      <text y="86" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="13" fill="#ea580c" text-anchor="middle">Mayoristas</text>
    </g>
  </g>
</svg>`;

// 8. COTILLÓN & EVENTOS (KOALA FESTIVO CON GORRITO Y BPN)
const svg8 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
  <defs>
    <linearGradient id="bgGrad8" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fffbeb"/>
      <stop offset="100%" stop-color="#fef3c7"/>
    </linearGradient>
    <filter id="shadow8" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="5" stdDeviation="5" flood-opacity="0.2"/>
    </filter>
  </defs>

  <rect width="600" height="750" fill="url(#bgGrad8)" rx="24"/>

  <!-- Top Display Title -->
  <g transform="translate(300, 75)" text-anchor="middle">
    <text font-family="'Fredoka', system-ui, -apple-system, sans-serif" font-weight="900" font-size="46" fill="#f97316" stroke="#0f172a" stroke-width="4" paint-order="stroke fill">
      COTILLÓN
    </text>
    <text y="52" font-family="'Fredoka', system-ui, -apple-system, sans-serif" font-weight="900" font-size="46" fill="#f97316" stroke="#0f172a" stroke-width="4" paint-order="stroke fill">
      &amp; EVENTOS
    </text>
  </g>

  <!-- Festive Confetti Background -->
  <g opacity="0.6">
    <circle cx="50" cy="120" r="8" fill="#f43f5e"/>
    <circle cx="120" cy="80" r="6" fill="#3b82f6"/>
    <circle cx="480" cy="120" r="9" fill="#10b981"/>
    <circle cx="540" cy="80" r="7" fill="#f59e0b"/>
    <rect x="70" y="160" width="12" height="6" fill="#8b5cf6" transform="rotate(30 70 160)"/>
    <rect x="510" y="170" width="12" height="6" fill="#ec4899" transform="rotate(-40 510 170)"/>
    <!-- Floating Balloons at Left & Right -->
    <ellipse cx="60" cy="240" rx="25" ry="32" fill="#ef4444"/>
    <ellipse cx="90" cy="300" rx="28" ry="36" fill="#3b82f6"/>
    <ellipse cx="530" cy="240" rx="25" ry="32" fill="#a855f7"/>
    <ellipse cx="500" cy="300" rx="28" ry="36" fill="#06b6d4"/>
  </g>

  <!-- Happy Festive Koala with Striped Birthday Party Hat -->
  <g transform="translate(300, 270)">
    <!-- Ears -->
    <circle cx="-65" cy="-35" r="34" fill="#94a3b8"/>
    <circle cx="-65" cy="-35" r="22" fill="#fbcfe8"/>
    <circle cx="65" cy="-35" r="34" fill="#94a3b8"/>
    <circle cx="65" cy="-35" r="22" fill="#fbcfe8"/>
    <!-- Head -->
    <ellipse cx="0" cy="0" rx="60" ry="50" fill="#cbd5e1" filter="url(#shadow8)"/>
    <!-- Cheeks -->
    <circle cx="-35" cy="12" r="10" fill="#f472b6" opacity="0.6"/>
    <circle cx="35" cy="12" r="10" fill="#f472b6" opacity="0.6"/>
    <!-- Eyes -->
    <ellipse cx="-22" cy="-6" rx="8" ry="11" fill="#0f172a"/>
    <circle cx="-20" cy="-9" r="3.5" fill="#ffffff"/>
    <ellipse cx="22" cy="-6" rx="8" ry="11" fill="#0f172a"/>
    <circle cx="24" cy="-9" r="3.5" fill="#ffffff"/>
    <!-- Nose -->
    <ellipse cx="0" cy="4" rx="18" ry="24" fill="#475569"/>
    <!-- Smile -->
    <path d="M -12 24 Q 0 34 12 24" fill="none" stroke="#0f172a" stroke-width="3"/>
    
    <!-- Colorful Party Cone Hat -->
    <g transform="translate(0, -50)">
      <path d="M 0 -45 L -25 0 L 25 0 Z" fill="#f59e0b" stroke="#0f172a" stroke-width="2"/>
      <path d="M -8 -30 L 8 -30 L 15 -16 L -15 -16 Z" fill="#ef4444"/>
      <path d="M -18 -10 L 18 -10 L 25 0 L -25 0 Z" fill="#3b82f6"/>
      <circle cx="0" cy="-48" r="6" fill="#fbcfe8"/>
    </g>
  </g>

  <!-- BPN Center Promo Card (Held in Mascot's Center) -->
  <g transform="translate(300, 420)">
    <rect x="-170" y="-55" width="340" height="150" rx="20" fill="#ffffff" stroke="#0284c7" stroke-width="3" filter="url(#shadow8)"/>
    
    <!-- BPN Header inside Card -->
    <g transform="translate(-80, -20)">
      <circle cx="0" cy="0" r="22" fill="#0284c7"/>
      <path d="M 0 12 L 0 -12 M -10 -4 L 0 -12 L 10 -4 M -12 4 L 0 -8 L 12 4" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
    </g>
    <text x="-45" y="-8" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="34" fill="#0284c7">BPN</text>
    <text x="-45" y="8" font-family="'Fredoka', system-ui, sans-serif" font-weight="600" font-size="9" fill="#0369a1">Banco Provincia del Neuquén</text>

    <!-- Promo Texts -->
    <text y="38" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="20" fill="#0f172a" text-anchor="middle">
      Cuotas sin Interés
    </text>
    <text y="58" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="20" fill="#0f172a" text-anchor="middle">
      con BPN Confiable
    </text>

    <!-- 10% OFF Badge inside Card -->
    <text y="82" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="22" fill="#ea580c" text-anchor="middle">
      10% OFF
    </text>
    <text y="94" font-family="'Fredoka', system-ui, sans-serif" font-weight="800" font-size="12" fill="#475569" text-anchor="middle">
      transf. bancaria
    </text>
  </g>

  <!-- Bakery & Party Accessories Illustrations (Bottom Sides) -->
  <g transform="translate(100, 520)">
    <!-- Muffin Tray & Disposables -->
    <rect x="-35" y="0" width="70" height="45" rx="6" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>
    <circle cx="-20" cy="15" r="8" fill="#cbd5e1"/>
    <circle cx="0" cy="15" r="8" fill="#cbd5e1"/>
    <circle cx="20" cy="15" r="8" fill="#cbd5e1"/>
    <circle cx="-20" cy="32" r="8" fill="#cbd5e1"/>
    <circle cx="0" cy="32" r="8" fill="#cbd5e1"/>
    <circle cx="20" cy="32" r="8" fill="#cbd5e1"/>
  </g>

  <g transform="translate(500, 520)">
    <!-- Party favor cup with lollipops -->
    <path d="M -20 15 L 20 15 L 15 50 L -15 50 Z" fill="#0284c7" stroke="#0f172a" stroke-width="2"/>
    <circle cx="-10" cy="5" r="10" fill="#10b981"/>
    <circle cx="10" cy="0" r="10" fill="#ec4899"/>
  </g>

  <!-- Category Pills along Bottom -->
  <g transform="translate(300, 640)" text-anchor="middle">
    <!-- Row 1: Globos, Vajilla, Moldes -->
    <g transform="translate(0, 0)">
      <rect x="-240" y="-15" width="100" height="30" rx="15" fill="#ffffff" stroke="#ea580c" stroke-width="1.5"/>
      <text x="-190" y="5" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="15" fill="#0f172a">Globos</text>

      <rect x="-120" y="-15" width="100" height="30" rx="15" fill="#ffffff" stroke="#ea580c" stroke-width="1.5"/>
      <text x="-70" y="5" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="15" fill="#0f172a">Vajilla</text>

      <rect x="0" y="-15" width="100" height="30" rx="15" fill="#ffffff" stroke="#ea580c" stroke-width="1.5"/>
      <text x="50" y="5" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="15" fill="#0f172a">Moldes</text>

      <rect x="120" y="-15" width="120" height="30" rx="15" fill="#ffffff" stroke="#ea580c" stroke-width="1.5"/>
      <text x="180" y="5" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="15" fill="#0f172a">Repostería</text>
    </g>

    <!-- Row 2: Puntos Club Koala -->
    <g transform="translate(0, 42)">
      <rect x="-140" y="-15" width="280" height="32" rx="16" fill="#0f172a"/>
      <text y="7" font-family="'Fredoka', system-ui, sans-serif" font-weight="900" font-size="16" fill="#ffffff">Puntos Club Koala</text>
    </g>
  </g>
</svg>`;

fs.writeFileSync(path.join(outDir, 'ig_mega_ofertas_intro.svg'), svg1);
fs.writeFileSync(path.join(outDir, 'ig_ofertas_polietileno_precios.svg'), svg2);
fs.writeFileSync(path.join(outDir, 'ig_cotillon_financiacion_bpn.svg'), svg3);
fs.writeFileSync(path.join(outDir, 'ig_pedidos_whatsapp_visitanos.svg'), svg4);
fs.writeFileSync(path.join(outDir, 'ig_visitanos_mapa_locales.svg'), svg5);
fs.writeFileSync(path.join(outDir, 'ig_mega_ofertas_tienda_pasillo.svg'), svg6);
fs.writeFileSync(path.join(outDir, 'ig_polietileno_fabrica_casco.svg'), svg7);
fs.writeFileSync(path.join(outDir, 'ig_cotillon_eventos_fiesta_bpn.svg'), svg8);

console.log('Successfully generated all 8 Instagram SVGs in public/instagram!');
