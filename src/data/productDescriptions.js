// Product descriptions for socks and sleeves
// Same data shape as linerDescriptions.js so LinerContentSections can render them

// Shared sock fields
const SOCK_SHARED = {
  sizingType: 'sock',
  applicationInstructions: [
    'Lay the sock smoothly over your residual limb rather than pulling it tight over the end.',
    'Avoid stretching the fabric excessively over the distal end, as this reduces effective ply thickness where cushioning matters most.',
    'A 5-ply sock pulled too tightly may function closer to a 3-ply at the distal end.',
    'Start with fewer plies in the morning when your limb volume is largest.',
    'Add plies throughout the day as your limb volume decreases.',
  ],
  careInstructions: [
    'Wash prosthetic socks daily after each use.',
    'Machine wash using standard laundry detergent.',
    'Use non-chlorine bleach only when necessary and rinse thoroughly.',
    'After washing, gently pull the sock taut from toe to top to restore its shape.',
    'Tumble dry on low heat.',
  ],
  precautions: [
    'Do not use liquid fabric softeners, as they can break down fibers and reduce effective ply thickness.',
    'Replace socks when they feel thinner, the elastic has loosened, or volume management is no longer effective.',
  ],
  measuringGuide: [
    'Measure the circumference of your residual limb 5 cm from the distal end for width sizing.',
    'For BK: measure from the distal end to 2-3 inches above the kneecap for length, plus circumference around the kneecap.',
    'For AK: measure 5 cm from the distal end circumference and at the top of the groin.',
  ],
};

export const PRODUCT_DESCRIPTIONS = {
  // Pin Lock socks
  'Pin Lock': {
    ...SOCK_SHARED,
    shortDescription: 'Prosthetic socks with a distal hole for pin lock suspension systems. Manage daily limb volume changes while maintaining a comfortable, secure socket fit.',
    overview: [
      'Knit-Rite prosthetic socks for pin lock systems feature a distal hole that accommodates the pin mechanism on your liner. Worn over a prosthetic liner, these socks help manage daily limb volume changes while maintaining a comfortable, secure socket fit.',
      'Available in multiple ply weights — Lightweight, 3-Ply, and 5-Ply — each sock allows precise volume management throughout the day. Start with fewer plies in the morning and add more as your limb volume decreases.',
      'Made with a soft, breathable knit construction, Knit-Rite socks provide comfort against the skin while helping wick moisture and conform to the shape of the limb.',
    ],
    features: [
      'Distal hole accommodates pin lock liner systems',
      'Sold in convenient 3-packs',
      'Available in Lightweight, 3-Ply, and 5-Ply options for different levels of volume management',
      'Multiple lengths and widths available for an optimal fit',
      'Soft, breathable knit construction designed for everyday wear',
      'Helps manage daily limb volume fluctuations for consistent socket fit',
    ],
  },

  // Suction socks
  'Suction': {
    ...SOCK_SHARED,
    shortDescription: 'Prosthetic socks with a closed, airtight distal end for suction and vacuum suspension systems. Manage daily limb volume changes without compromising your seal.',
    overview: [
      'Knit-Rite prosthetic socks for suction systems feature a closed, airtight distal end that maintains the vacuum seal required by suction and elevated vacuum suspension systems. Worn over a prosthetic liner or directly against the skin, these socks help manage daily limb volume changes.',
      'Available in multiple ply weights — Lightweight, 3-Ply, and 5-Ply — each sock allows precise volume management throughout the day. Start with fewer plies in the morning and add more as your limb volume decreases.',
      'Made with a soft, breathable knit construction, Knit-Rite socks provide comfort against the skin while helping wick moisture and conform to the shape of the limb.',
    ],
    features: [
      'Closed distal end maintains airtight seal for suction and vacuum systems',
      'Sold in convenient 3-packs',
      'Available in Lightweight, 3-Ply, and 5-Ply options for different levels of volume management',
      'Multiple lengths and widths available for an optimal fit',
      'Soft, breathable knit construction designed for everyday wear',
      'Helps manage daily limb volume fluctuations for consistent socket fit',
    ],
  },

  // Prosthetic Sleeves (Ottobock ProFlex)
  'ProFlex': {
    sizingType: 'sleeve-bk', // Will need sizing data entry
    shortDescription: 'The Ottobock ProFlex Suspension Sleeve provides secure suspension and a comfortable fit for prosthetic users. Made with flexible, durable material, it helps maintain socket connection during daily activities.',
    overview: [
      'The ProFlex Plus Suspension Sleeve is designed to provide reliable suspension for below-knee prosthetic systems by creating a secure seal between the prosthetic socket and the limb. It is part of the widely used ProFlex line of sealing sleeves.',
      'The ProFlex Plus incorporates a more flexible fabric construction and a smoother proximal seam to improve comfort while maintaining durability and sealing performance. The material provides a soft, supple feel while remaining resilient for daily prosthetic use.',
      'The sleeve is compatible with common suction and vacuum suspension systems, including valve, DVS, and Harmony fittings.',
      'ProFlex Plus represents an evolution of the established ProFlex sleeve and is now available in beige.',
    ],
    features: [
      'Sealing sleeve designed for below-knee prosthetic suspension',
      'Flexible fabric construction for improved comfort and conformity',
      'Smooth proximal seam designed to reduce irritation',
      'Compatible with valve, DVS, and Harmony suspension systems',
      'Durable construction for daily use',
      'Available in black, beige, and grey',
    ],
    applicationInstructions: [
      'Roll the sleeve onto your leg, centering it over the knee area so it covers both the proximal edge of the socket and bare skin above.',
      'Smooth out any wrinkles or air pockets to maintain a consistent seal.',
      'Confirm the sleeve creates a secure connection between your skin and the socket before weight-bearing.',
    ],
    careInstructions: [
      'Hand wash with pH-neutral soap using warm water (approximately 30°C / 86°F).',
      'Do not wring the sleeve.',
      'Rinse thoroughly under clean, running water.',
      'Blot excess moisture with a towel and allow to air dry completely on a drying rack or laid flat.',
    ],
    precautions: [
      'Remove the sleeve for several hours each day to allow your skin to air out.',
      'When not in use, reinsert the packaging foam into the sleeve to help maintain its shape.',
      'Replace the sleeve when you notice loss of seal, visible tears, or the material has stretched beyond its original shape.',
    ],
    measuringGuide: [
      'Measure the circumference around your kneecap to determine the correct sleeve size.',
      'Refer to the Ottobock sizing chart to match your measurement to the appropriate size.',
    ],
  },
};

// Normalize product names for matching
function normalize(str) {
  return str
    .replace(/Above[- ]Knee/gi, 'AK')
    .replace(/Below[- ]Knee/gi, 'BK')
    .replace(/Prosthetic\s+/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Find a matching description for a non-liner product
export function findProductDescription(title) {
  if (!title) return null;
  const normalized = normalize(title).toLowerCase();
  const entry = Object.entries(PRODUCT_DESCRIPTIONS).find(
    ([key]) => normalized.includes(key.toLowerCase())
  );
  return entry ? entry[1] : null;
}
