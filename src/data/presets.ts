import { DetectionPreset } from '../types';

function createSvgDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

// Preset 1: No Helmet Violation
const svgNoHelmet = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
  <defs>
    <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="60%" stop-color="#bae6fd" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>
    <linearGradient id="road1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>
  <!-- Background & Cityscape -->
  <rect width="960" height="320" fill="url(#sky1)" />
  <rect x="0" y="320" width="960" height="220" fill="url(#road1)" />
  <!-- Road divider markings -->
  <line x1="0" y1="430" x2="960" y2="430" stroke="#f8fafc" stroke-width="6" stroke-dasharray="35,25" />
  
  <!-- Urban buildings background -->
  <rect x="40" y="160" width="110" height="160" fill="#94a3b8" />
  <rect x="180" y="120" width="130" height="200" fill="#64748b" />
  <rect x="720" y="140" width="140" height="180" fill="#94a3b8" />

  <!-- Road Traffic Sign -->
  <line x1="880" y1="230" x2="880" y2="350" stroke="#64748b" stroke-width="5" />
  <circle cx="880" cy="230" r="30" fill="#ffffff" stroke="#ef4444" stroke-width="6" />
  <text x="880" y="238" font-family="sans-serif" font-size="18" font-weight="bold" fill="#0f172a" text-anchor="middle">50</text>

  <!-- Motorcycle Frame -->
  <!-- Rear wheel -->
  <circle cx="340" cy="420" r="54" fill="#0f172a" stroke="#64748b" stroke-width="12" />
  <circle cx="340" cy="420" r="22" fill="#94a3b8" />
  <!-- Front wheel -->
  <circle cx="580" cy="420" r="54" fill="#0f172a" stroke="#64748b" stroke-width="12" />
  <circle cx="580" cy="420" r="22" fill="#94a3b8" />
  <!-- Chassis & Engine -->
  <polygon points="340,420 460,420 520,360 430,340 370,360" fill="#dc2626" stroke="#b91c1c" stroke-width="3" />
  <rect x="410" y="380" width="60" height="40" rx="6" fill="#475569" stroke="#334155" stroke-width="2" />
  <!-- Handlebars & Exhaust -->
  <line x1="520" y1="360" x2="550" y2="280" stroke="#0f172a" stroke-width="8" stroke-linecap="round" />
  <line x1="535" y1="285" x2="570" y2="280" stroke="#1e293b" stroke-width="7" stroke-linecap="round" />
  <path d="M430,420 L310,435" stroke="#94a3b8" stroke-width="8" stroke-linecap="round" />

  <!-- Rider Body (No Helmet) -->
  <!-- Torso & Arms -->
  <polygon points="420,335 480,335 490,230 430,230" fill="#1e3a8a" />
  <line x1="480" y1="240" x2="540" y2="280" stroke="#1e3a8a" stroke-width="14" stroke-linecap="round" />
  <!-- Legs -->
  <line x1="440" y1="335" x2="470" y2="400" stroke="#1e293b" stroke-width="16" stroke-linecap="round" />
  <line x1="470" y1="400" x2="480" y2="425" stroke="#0f172a" stroke-width="14" stroke-linecap="round" />

  <!-- Bare Head (NO HELMET VIOLATION) -->
  <ellipse cx="460" cy="180" rx="26" ry="32" fill="#fed7aa" />
  <!-- Black Hair -->
  <path d="M435,175 Q460,140 485,170 Q485,150 460,145 Q435,150 435,175 Z" fill="#1e293b" />
  <!-- Face Profile -->
  <circle cx="478" cy="178" r="3.5" fill="#0f172a" />
  <path d="M485,185 L480,188" stroke="#0f172a" stroke-width="2" />

  <!-- Rear License Plate -->
  <rect x="275" y="405" width="85" height="30" rx="3" fill="#fef08a" stroke="#000000" stroke-width="2" />
  <text x="317" y="426" font-family="monospace" font-size="13" font-weight="900" fill="#000000" text-anchor="middle">MH12AB1234</text>
  
  <!-- Surveillance HUD Watermark -->
  <rect x="20" y="20" width="280" height="35" rx="4" fill="rgba(15,23,42,0.8)" stroke="#38bdf8" stroke-width="1" />
  <text x="32" y="42" font-family="monospace" font-size="12" fill="#38bdf8" font-weight="600">CAM-01 · SHIVAJI CHOWK · 2K</text>
</svg>`;

// Preset 2: Triple Riding Violation
const svgTripleRiding = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
  <defs>
    <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>
    <linearGradient id="road2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
  </defs>
  <rect width="960" height="330" fill="url(#sky2)" />
  <rect x="0" y="330" width="960" height="210" fill="url(#road2)" />
  <line x1="0" y1="435" x2="960" y2="435" stroke="#f8fafc" stroke-width="6" stroke-dasharray="35,25" />

  <!-- Highway overhead gantry -->
  <line x1="60" y1="80" x2="60" y2="330" stroke="#475569" stroke-width="10" />
  <line x1="900" y1="80" x2="900" y2="330" stroke="#475569" stroke-width="10" />
  <rect x="50" y="70" width="860" height="25" fill="#334155" />
  <rect x="360" y="60" width="240" height="42" rx="4" fill="#047857" stroke="#10b981" stroke-width="2" />
  <text x="480" y="86" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">RING ROAD EXPRESSWAY</text>

  <!-- Motorcycle (Stretched chassis) -->
  <circle cx="280" cy="430" r="55" fill="#0f172a" stroke="#64748b" stroke-width="12" />
  <circle cx="640" cy="430" r="55" fill="#0f172a" stroke="#64748b" stroke-width="12" />
  <polygon points="280,430 460,430 580,360 400,340 320,360" fill="#0284c7" stroke="#0369a1" stroke-width="3" />
  <line x1="580" y1="360" x2="610" y2="280" stroke="#0f172a" stroke-width="8" stroke-linecap="round" />
  <line x1="595" y1="285" x2="630" y2="280" stroke="#1e293b" stroke-width="7" stroke-linecap="round" />

  <!-- Pillion Rider 3 (Back) -->
  <polygon points="320,340 370,340 380,240 330,240" fill="#b91c1c" />
  <ellipse cx="355" cy="190" rx="22" ry="28" fill="#fde68a" />
  <path d="M335,185 Q355,150 375,180 Z" fill="#1e293b" />

  <!-- Pillion Rider 2 (Middle) -->
  <polygon points="380,340 430,340 440,230 390,230" fill="#047857" />
  <ellipse cx="415" cy="180" rx="22" ry="28" fill="#fed7aa" />
  <path d="M395,175 Q415,140 435,170 Z" fill="#451a03" />

  <!-- Main Driver Rider 1 (Front) -->
  <polygon points="440,335 490,335 510,225 450,225" fill="#4338ca" />
  <line x1="490" y1="235" x2="600" y2="280" stroke="#4338ca" stroke-width="14" stroke-linecap="round" />
  <ellipse cx="485" cy="175" rx="24" ry="29" fill="#fed7aa" />
  <path d="M465,170 Q485,135 505,165 Z" fill="#0f172a" />

  <!-- License Plate -->
  <rect x="220" y="415" width="85" height="30" rx="3" fill="#fef08a" stroke="#000000" stroke-width="2" />
  <text x="262" y="436" font-family="monospace" font-size="13" font-weight="900" fill="#000000" text-anchor="middle">DL01CZ8899</text>

  <!-- Surveillance Watermark -->
  <rect x="20" y="20" width="280" height="35" rx="4" fill="rgba(15,23,42,0.8)" stroke="#f59e0b" stroke-width="1" />
  <text x="32" y="42" font-family="monospace" font-size="12" fill="#f59e0b" font-weight="600">CAM-02 · RING RD SOUTH · 2K</text>
</svg>`;

// Preset 3: Mobile Phone Usage While Riding
const svgMobileUsage = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
  <defs>
    <linearGradient id="sky3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </linearGradient>
    <linearGradient id="road3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#090d16" />
    </linearGradient>
  </defs>
  <rect width="960" height="320" fill="url(#sky3)" />
  <rect x="0" y="320" width="960" height="220" fill="url(#road3)" />
  <line x1="0" y1="430" x2="960" y2="430" stroke="#f8fafc" stroke-width="6" stroke-dasharray="35,25" />

  <!-- Scooter / Motorbike -->
  <circle cx="340" cy="420" r="52" fill="#0f172a" stroke="#64748b" stroke-width="12" />
  <circle cx="580" cy="420" r="52" fill="#0f172a" stroke="#64748b" stroke-width="12" />
  <polygon points="340,420 460,420 540,360 420,340 360,360" fill="#eab308" stroke="#ca8a04" stroke-width="3" />
  <line x1="540" y1="360" x2="570" y2="280" stroke="#0f172a" stroke-width="8" stroke-linecap="round" />

  <!-- Rider wearing helmet BUT actively using smartphone with right hand -->
  <polygon points="410,335 470,335 480,230 420,230" fill="#334155" />
  
  <!-- Left hand holding handle -->
  <line x1="450" y1="240" x2="560" y2="285" stroke="#334155" stroke-width="13" stroke-linecap="round" />
  
  <!-- Helmet on Head -->
  <ellipse cx="450" cy="175" rx="30" ry="34" fill="#1e293b" stroke="#38bdf8" stroke-width="3" />
  <!-- Helmet Visor -->
  <path d="M460,165 Q485,175 460,195 Z" fill="#38bdf8" opacity="0.8" />

  <!-- Right Arm raised holding smartphone near ear/face -->
  <line x1="465" y1="230" x2="480" y2="185" stroke="#334155" stroke-width="13" stroke-linecap="round" />
  <!-- Handheld Smartphone -->
  <rect x="475" y="165" width="16" height="28" rx="3" fill="#f8fafc" stroke="#0f172a" stroke-width="2" />
  <rect x="477" y="168" width="12" height="20" fill="#38bdf8" />

  <!-- License Plate -->
  <rect x="275" y="405" width="85" height="30" rx="3" fill="#fef08a" stroke="#000000" stroke-width="2" />
  <text x="317" y="426" font-family="monospace" font-size="13" font-weight="900" fill="#000000" text-anchor="middle">KA03XY4521</text>

  <!-- Watermark -->
  <rect x="20" y="20" width="280" height="35" rx="4" fill="rgba(15,23,42,0.8)" stroke="#f59e0b" stroke-width="1" />
  <text x="32" y="42" font-family="monospace" font-size="12" fill="#f59e0b" font-weight="600">CAM-03 · OUTER RING RD · 2K</text>
</svg>`;

// Preset 4: Safe Compliant Rider
const svgCompliant = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
  <defs>
    <linearGradient id="sky4" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#bae6fd" />
    </linearGradient>
    <linearGradient id="road4" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>
  <rect width="960" height="320" fill="url(#sky4)" />
  <rect x="0" y="320" width="960" height="220" fill="url(#road4)" />
  <line x1="0" y1="430" x2="960" y2="430" stroke="#f8fafc" stroke-width="6" stroke-dasharray="35,25" />

  <!-- Modern Commuter Motorcycle -->
  <circle cx="340" cy="420" r="54" fill="#0f172a" stroke="#64748b" stroke-width="12" />
  <circle cx="580" cy="420" r="54" fill="#0f172a" stroke="#64748b" stroke-width="12" />
  <polygon points="340,420 460,420 540,360 420,340 360,360" fill="#16a34a" stroke="#15803d" stroke-width="3" />
  <line x1="540" y1="360" x2="570" y2="280" stroke="#0f172a" stroke-width="8" stroke-linecap="round" />
  <line x1="555" y1="285" x2="590" y2="280" stroke="#1e293b" stroke-width="7" stroke-linecap="round" />

  <!-- Rider Body (Compliant safety jacket) -->
  <polygon points="410,335 470,335 480,230 420,230" fill="#059669" />
  <!-- Both hands firmly on handlebars -->
  <line x1="465" y1="240" x2="565" y2="282" stroke="#059669" stroke-width="14" stroke-linecap="round" />

  <!-- Certified Full-Face Helmet (COMPLIANT) -->
  <ellipse cx="450" cy="175" rx="30" ry="34" fill="#0f172a" stroke="#10b981" stroke-width="3.5" />
  <!-- Reflective safety strip -->
  <path d="M430,165 Q450,155 470,165" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" />
  <!-- Full dark visor down -->
  <path d="M455,165 Q485,175 455,195 Z" fill="#0284c7" opacity="0.9" />

  <!-- License Plate -->
  <rect x="275" y="405" width="85" height="30" rx="3" fill="#fef08a" stroke="#000000" stroke-width="2" />
  <text x="317" y="426" font-family="monospace" font-size="13" font-weight="900" fill="#000000" text-anchor="middle">TN09BD9012</text>

  <!-- Watermark -->
  <rect x="20" y="20" width="280" height="35" rx="4" fill="rgba(15,23,42,0.8)" stroke="#10b981" stroke-width="1" />
  <text x="32" y="42" font-family="monospace" font-size="12" fill="#10b981" font-weight="600">CAM-04 · AIRPORT EXPWY · 2K</text>
</svg>`;

// Preset 5: Multi-Vehicle Traffic Junction
const svgMultiJunction = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
  <defs>
    <linearGradient id="sky5" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#64748b" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>
    <linearGradient id="road5" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>
  <rect width="960" height="300" fill="url(#sky5)" />
  <rect x="0" y="300" width="960" height="240" fill="url(#road5)" />
  <line x1="0" y1="420" x2="960" y2="420" stroke="#f8fafc" stroke-width="5" stroke-dasharray="30,20" />

  <!-- Traffic Signal Post -->
  <line x1="120" y1="120" x2="120" y2="350" stroke="#334155" stroke-width="8" />
  <rect x="100" y="90" width="40" height="90" rx="6" fill="#0f172a" stroke="#64748b" stroke-width="2" />
  <circle cx="120" cy="110" r="10" fill="#ef4444" opacity="0.4" />
  <circle cx="120" cy="135" r="10" fill="#f59e0b" opacity="0.4" />
  <circle cx="120" cy="160" r="10" fill="#10b981" opacity="1.0" />

  <!-- Vehicle 1: No Helmet Rider in foreground -->
  <circle cx="480" cy="430" r="50" fill="#0f172a" stroke="#64748b" stroke-width="10" />
  <circle cx="680" cy="430" r="50" fill="#0f172a" stroke="#64748b" stroke-width="10" />
  <polygon points="480,430 580,430 650,370 540,350 490,370" fill="#dc2626" />
  <line x1="650" y1="370" x2="675" y2="290" stroke="#0f172a" stroke-width="8" stroke-linecap="round" />

  <!-- Rider 1 without helmet -->
  <polygon points="530,350 580,350 590,250 540,250" fill="#0284c7" />
  <line x1="580" y1="260" x2="665" y2="295" stroke="#0284c7" stroke-width="12" stroke-linecap="round" />
  <ellipse cx="565" cy="200" rx="24" ry="28" fill="#fed7aa" />
  <path d="M545,195 Q565,160 585,190 Z" fill="#1e293b" />

  <!-- License Plate -->
  <rect x="420" y="415" width="85" height="28" rx="3" fill="#fef08a" stroke="#000000" stroke-width="2" />
  <text x="462" y="434" font-family="monospace" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">MH14CD5678</text>

  <!-- Vehicle 2 in background (Car) -->
  <rect x="740" y="320" width="180" height="90" rx="10" fill="#475569" stroke="#334155" stroke-width="2" />
  <circle cx="780" cy="410" r="24" fill="#0f172a" />
  <circle cx="880" cy="410" r="24" fill="#0f172a" />

  <!-- Watermark -->
  <rect x="20" y="20" width="280" height="35" rx="4" fill="rgba(15,23,42,0.8)" stroke="#38bdf8" stroke-width="1" />
  <text x="32" y="42" font-family="monospace" font-size="12" fill="#38bdf8" font-weight="600">CAM-05 · MG ROAD CROSS · 2K</text>
</svg>`;

export const DETECTION_PRESETS: DetectionPreset[] = [
  {
    id: 'preset-no-helmet',
    title: 'No Helmet Violation (Single Rider)',
    tagline: 'Commuter motorbike rider detected bareheaded without protective gear.',
    violationType: 'NO_HELMET',
    vehicleNumber: 'MH12AB1234',
    imageDataUrl: createSvgDataUrl(svgNoHelmet),
    expectedResult: {
      engine: 'AI_SURVEILLANCE_CORE',
      vehicles: [
        {
          type: 'motorcycle',
          box: [260, 290, 880, 680],
          confidence: 0.97,
        },
      ],
      riders: [
        {
          index: 1,
          box: [140, 410, 720, 560],
          headBox: [140, 430, 250, 500],
          hasHelmet: false,
          helmetType: 'none',
          confidence: 0.96,
        },
      ],
      riderCount: 1,
      helmetDetected: false,
      licensePlate: {
        detected: true,
        text: 'MH12AB1234',
        box: [750, 280, 810, 380],
        confidence: 0.95,
        ocrEngine: 'Tesseract OCR v5.3',
      },
      violations: [
        {
          type: 'NO_HELMET',
          title: 'Riding Without Safety Helmet',
          description: 'Motorcycle operator observed driving without prescribed protective headgear compliant with safety standards.',
          confidence: 0.96,
          severity: 'HIGH',
          legalCode: 'Section 129 / 194D Motor Vehicles Act',
          fineAmount: 1000,
        },
      ],
      sceneSummary: '1 two-wheeler detected. Rider is not wearing a helmet. License plate MH12AB1234 recognized with 95% OCR confidence.',
    },
  },
  {
    id: 'preset-triple-riding',
    title: 'Triple Riding Violation (3 Persons)',
    tagline: '3 adult occupants travelling on single two-wheeler chassis, exceeding safe capacity.',
    violationType: 'TRIPLE_RIDING',
    vehicleNumber: 'DL01CZ8899',
    imageDataUrl: createSvgDataUrl(svgTripleRiding),
    expectedResult: {
      engine: 'AI_SURVEILLANCE_CORE',
      vehicles: [
        {
          type: 'motorcycle',
          box: [250, 240, 890, 720],
          confidence: 0.96,
        },
      ],
      riders: [
        {
          index: 1,
          box: [140, 440, 710, 570],
          headBox: [140, 455, 240, 520],
          hasHelmet: false,
          helmetType: 'none',
          confidence: 0.94,
        },
        {
          index: 2,
          box: [150, 380, 700, 470],
          headBox: [150, 395, 240, 450],
          hasHelmet: false,
          helmetType: 'none',
          confidence: 0.92,
        },
        {
          index: 3,
          box: [160, 320, 690, 400],
          headBox: [160, 335, 250, 390],
          hasHelmet: false,
          helmetType: 'none',
          confidence: 0.91,
        },
      ],
      riderCount: 3,
      helmetDetected: false,
      licensePlate: {
        detected: true,
        text: 'DL01CZ8899',
        box: [770, 220, 830, 320],
        confidence: 0.93,
        ocrEngine: 'Tesseract OCR v5.3',
      },
      violations: [
        {
          type: 'TRIPLE_RIDING',
          title: 'Triple Riding on Two-Wheeler',
          description: 'Motorcycle detected carrying 3 passengers simultaneously. Maximum permitted legal seating capacity is 2 persons.',
          confidence: 0.94,
          severity: 'HIGH',
          legalCode: 'Section 128 / 194C Motor Vehicles Act',
          fineAmount: 1000,
        },
        {
          type: 'NO_HELMET',
          title: 'Multiple Riders Without Helmet',
          description: 'Occupants traveling on motorcycle without approved protective headgear.',
          confidence: 0.93,
          severity: 'HIGH',
          legalCode: 'Section 129 / 194D Motor Vehicles Act',
          fineAmount: 1000,
        },
      ],
      sceneSummary: 'High-risk violation: 3 riders detected on two-wheeler chassis. Multiple helmet infractions logged with vehicle DL01CZ8899.',
    },
  },
  {
    id: 'preset-mobile-usage',
    title: 'Mobile Phone Usage While Riding',
    tagline: 'Rider holding handheld electronic device to ear while in motion.',
    violationType: 'MOBILE_USAGE',
    vehicleNumber: 'KA03XY4521',
    imageDataUrl: createSvgDataUrl(svgMobileUsage),
    expectedResult: {
      engine: 'AI_SURVEILLANCE_CORE',
      vehicles: [
        {
          type: 'scooter',
          box: [260, 290, 870, 660],
          confidence: 0.95,
        },
      ],
      riders: [
        {
          index: 1,
          box: [140, 410, 710, 560],
          headBox: [140, 420, 240, 490],
          hasHelmet: true,
          helmetType: 'full_face',
          isUsingMobile: true,
          confidence: 0.91,
        },
      ],
      riderCount: 1,
      helmetDetected: true,
      licensePlate: {
        detected: true,
        text: 'KA03XY4521',
        box: [750, 275, 810, 375],
        confidence: 0.91,
        ocrEngine: 'Tesseract OCR v5.3',
      },
      violations: [
        {
          type: 'MOBILE_USAGE',
          title: 'Handheld Mobile Device Usage',
          description: 'Rider observed operating handheld cellular telephone with right hand while maneuvering vehicle on public roadway.',
          confidence: 0.89,
          severity: 'HIGH',
          legalCode: 'Section 184(c) Dangerous Driving Act',
          fineAmount: 1500,
        },
      ],
      sceneSummary: 'Helmet verified on rider. Flagged for dangerous driving violation: handheld mobile phone usage while operating vehicle.',
    },
  },
  {
    id: 'preset-compliant-rider',
    title: 'Safe Compliant Rider (Standard Helmet)',
    tagline: 'Responsible commuter wearing certified full-face helmet with both hands on handlebars.',
    violationType: 'COMPLIANT',
    vehicleNumber: 'TN09BD9012',
    imageDataUrl: createSvgDataUrl(svgCompliant),
    expectedResult: {
      engine: 'AI_SURVEILLANCE_CORE',
      vehicles: [
        {
          type: 'motorcycle',
          box: [260, 290, 870, 660],
          confidence: 0.98,
        },
      ],
      riders: [
        {
          index: 1,
          box: [140, 410, 710, 560],
          headBox: [140, 420, 240, 490],
          hasHelmet: true,
          helmetType: 'full_face',
          isUsingMobile: false,
          confidence: 0.97,
        },
      ],
      riderCount: 1,
      helmetDetected: true,
      licensePlate: {
        detected: true,
        text: 'TN09BD9012',
        box: [750, 275, 810, 375],
        confidence: 0.94,
        ocrEngine: 'Tesseract OCR v5.3',
      },
      violations: [],
      sceneSummary: 'No violations detected. Rider is wearing certified safety helmet and operating vehicle safely. 100% compliance recorded.',
    },
  },
  {
    id: 'preset-junction-traffic',
    title: 'Urban Junction Multi-Vehicle Traffic',
    tagline: 'Intersection surveillance with multiple vehicles, helmet infraction isolated.',
    violationType: 'NO_HELMET',
    vehicleNumber: 'MH14CD5678',
    imageDataUrl: createSvgDataUrl(svgMultiJunction),
    expectedResult: {
      engine: 'AI_SURVEILLANCE_CORE',
      vehicles: [
        {
          type: 'motorcycle',
          box: [270, 430, 880, 730],
          confidence: 0.96,
        },
        {
          type: 'car',
          box: [320, 740, 480, 930],
          confidence: 0.94,
        },
      ],
      riders: [
        {
          index: 1,
          box: [160, 520, 710, 650],
          headBox: [160, 535, 260, 600],
          hasHelmet: false,
          helmetType: 'none',
          confidence: 0.95,
        },
      ],
      riderCount: 1,
      helmetDetected: false,
      licensePlate: {
        detected: true,
        text: 'MH14CD5678',
        box: [760, 420, 820, 520],
        confidence: 0.92,
        ocrEngine: 'Tesseract OCR v5.3',
      },
      violations: [
        {
          type: 'NO_HELMET',
          title: 'No Safety Helmet at Traffic Junction',
          description: 'Two-wheeler rider entering junction without protective headgear.',
          confidence: 0.95,
          severity: 'HIGH',
          legalCode: 'Section 129 / 194D Motor Vehicles Act',
          fineAmount: 1000,
        },
      ],
      sceneSummary: 'Dense traffic scenario. 2 vehicles tracked. Motorcyclist with registration MH14CD5678 flagged for bareheaded riding.',
    },
  },
];
