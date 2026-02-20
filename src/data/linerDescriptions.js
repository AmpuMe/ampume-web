// Structured liner descriptions from Alex's Product Page Descriptions document
// Keys are matched against product base name (extractBaseName(title))

export const LINER_DESCRIPTIONS = {
  'Alpha Classic AK Cushion': {
    sizingType: 'alpha-ak',
    overview: [
      'The Alpha\u00AE Classic Above-Knee (AK) Cushion Liner is designed for transfemoral prosthesis users seeking enhanced distal protection and adaptive pressure management.',
      'The AK profile incorporates 9 mm of gel distally, tapering to 3 mm proximally, with an integrated gel pad that cushions the distal lateral femur. This configuration helps protect sensitive distal anatomy while accommodating uneven socket pressures.',
      'Constructed from thermoplastic elastomer (TPE) enriched with medical-grade mineral oil and Vitamin E, the Classic Gel formulation features high flow and low rebound properties. The gel adapts dynamically to pressure changes while maintaining its shape over time.',
      'This cushion version utilizes Spirit fabric, offering flexibility during donning and doffing and compatibility with Velcro\u00AE-type suspension systems.',
      'Originally introduced in 1996, Alpha Classic was the first liner in the Alpha family and remains trusted for consistent performance and skin-friendly comfort.',
    ],
    features: [
      'Designed for transfemoral (AK) prosthesis users',
      '9 mm distal gel pad for femur protection',
      'Gel tapers to 3 mm proximally',
      'Mineral-oil\u2013based gel with Vitamin E',
      'High-flow gel adapts to socket pressures',
      'Low rebound maintains consistent cushioning',
      'Spirit fabric allows flexibility and secure suspension',
      'Heat moldable for prosthetic adjustments',
      'Latex-free and hypoallergenic',
      'Made in the USA',
      'Sold individually',
    ],
    specs: {
      'Profile': 'Above-Knee (AK)',
      'Gel Thickness': '9 mm distal \u2192 3 mm proximal',
      'Fabric': 'Spirit',
      'Suspension': 'Cushion (non-locking)',
      'Color': 'Buff',
    },
    measuringGuide: [
      'Measure circumference at 4 cm from the distal end of the residual limb',
      'Measure at 30 cm from the distal end',
      'Confirm sizing with your prosthetist',
    ],
    applicationInstructions: [
      'Ensure residual limb is clean and dry.',
      'Invert liner so logo is on the inside.',
      'Place distal end against limb.',
      'Roll liner onto limb without pulling.',
      'Do not pull the liner onto your limb. Avoid wrinkles or air pockets.',
    ],
    careInstructions: [
      'Clean gel side daily with lukewarm water and pH-balanced prosthetic cleanser',
      'Do not scrub gel or fabric surfaces',
      'Rinse thoroughly and dry with a lint-free cloth',
      'Dry with logo facing outward',
      'Disinfect weekly using ethyl alcohol spray, rinse, and dry',
    ],
    precautions: [
      'Do not use over open wounds',
      'Discontinue use if irritation or circulation issues occur',
      'Not vacuum-approved unless specified by provider',
    ],
  },

  'Alpha Classic AK Locking': {
    sizingType: 'alpha-ak',
    overview: [
      'The Alpha\u00AE Classic Above-Knee (AK) Locking Liner is designed for transfemoral users who utilize a pin-lock suspension system.',
      'It features a 9 mm distal to 3 mm proximal AK gel profile, providing enhanced distal femur cushioning and adaptive pressure distribution. This configuration helps protect sensitive distal anatomy while accommodating uneven socket pressures.',
      'Constructed from thermoplastic elastomer (TPE) enriched with medical-grade mineral oil and Vitamin E, the Classic Gel formulation features high flow and low rebound properties. The gel adapts dynamically to pressure changes while maintaining its shape over time.',
      'This locking version uses MAX fabric (one-way stretch) to reduce vertical pistoning and enhance suspension stability within the socket.',
      'Originally introduced in 1996, Alpha Classic was the first liner in the Alpha family and remains trusted for consistent performance and skin-friendly comfort.',
    ],
    features: [
      'Designed for transfemoral (AK) prosthesis users',
      '9 mm distal gel pad for femur protection',
      'Gel tapers to 3 mm proximally',
      'Compatible with pin-lock suspension systems',
      'MAX fabric reduces vertical pistoning',
      'Mineral-oil\u2013based gel with Vitamin E',
      'High-flow gel adapts to pressure changes',
      'Low rebound maintains shape',
      'Heat moldable for prosthetic adjustments',
      'Latex-free and hypoallergenic',
      'Made in the USA',
      'Sold individually',
    ],
    specs: {
      'Profile': 'Above-Knee (AK)',
      'Gel Thickness': '9 mm distal \u2192 3 mm proximal',
      'Fabric': 'MAX (one-way stretch)',
      'Suspension': 'Locking (pin compatible)',
      'Color': 'Buff',
    },
    measuringGuide: [
      'Measure circumference at 4 cm and 30 cm from distal end',
      'Confirm sizing with your prosthetist',
    ],
    applicationInstructions: [
      'Clean and dry limb.',
      'Invert liner.',
      'Center pin attachment.',
      'Roll onto limb without pulling.',
      'Avoid wrinkles or air pockets.',
    ],
    careInstructions: [
      'Clean daily with lukewarm water and pH-balanced cleanser',
      'Do not scrub surfaces',
      'Rinse thoroughly and dry completely',
      'Disinfect weekly with ethyl alcohol spray',
    ],
    precautions: [
      'Confirm locking pin compatibility before ordering',
      'Do not use over open wounds',
      'Discontinue use if irritation occurs',
    ],
  },

  'Alpha Classic BK Cushion': {
    sizingType: 'alpha-bk',
    overview: [
      'The Alpha\u00AE Classic Below-Knee (BK) Cushion Liner is designed for transtibial prosthesis users seeking adaptive pressure distribution and durable comfort.',
      'Constructed from thermoplastic elastomer (TPE) enriched with medical-grade mineral oil and Vitamin E, the Classic Gel formulation features high flow and low rebound properties. The gel adapts dynamically to pressure changes while maintaining its shape over time.',
      'Below-knee liners are available in 3 mm, 6 mm, and 9 mm gel thickness options, with 3 mm thickness along the posterior (back) aspect of the liner.',
      'Originally introduced in 1996, Alpha Classic was the first liner in the Alpha family and remains trusted for consistent performance and skin-friendly comfort.',
    ],
    features: [
      'Designed for transtibial (below-knee) prosthesis users',
      'Available in 3 mm, 6 mm, and 9 mm gel thickness options',
      '3 mm posterior thickness',
      'Mineral-oil\u2013based gel with Vitamin E',
      'High-flow gel adapts to uneven socket pressures',
      'Low rebound maintains shape consistency',
      'Heat moldable for prosthetic customization',
      'Available in Cushion and Locking styles',
      'Compatible with other Alpha liners of same profile and thickness',
      'Latex-free and hypoallergenic',
      'Made in the USA',
      'Sold individually',
    ],
    fabricOptions: [
      { name: 'Original Fabric', desc: 'Smooth finish, durable, supportive' },
      { name: 'Spirit Fabric', desc: 'Increased flexibility for easier donning and doffing' },
      { name: 'MAX Fabric', desc: 'Abrasion-resistant with unidirectional stretch to reduce pistoning' },
    ],
    specs: {
      'Profile': 'Below-Knee (BK)',
      'Suspension': 'Cushion (non-locking)',
      'Available Gel Thicknesses': '3 mm, 6 mm, 9 mm',
      'Posterior Thickness': '3 mm',
      'Gel Type': 'Mineral-oil\u2013based TPE',
    },
    measuringGuide: [
      'Measure circumference at 4 cm and 30 cm from distal end',
      'Confirm sizing with your prosthetist',
    ],
    applicationInstructions: [
      'Ensure limb is clean and dry',
      'Invert liner',
      'Place against distal limb',
      'Roll into position without pulling',
      'Avoid wrinkles or air pockets.',
    ],
    careInstructions: [
      'Clean daily with lukewarm water and pH-balanced cleanser',
      'Rinse and dry thoroughly',
      'Disinfect weekly with ethyl alcohol spray',
      'Do not scrub surfaces',
    ],
    precautions: [
      'Do not use over open wounds',
      'Discontinue use if irritation occurs',
      'Not vacuum-approved unless specified by provider',
    ],
  },

  'Alpha Classic BK Locking': {
    sizingType: 'alpha-bk',
    overview: [
      'The Alpha\u00AE Classic Below-Knee (BK) Locking Liner is designed for transtibial prosthesis users who utilize a pin-lock suspension system.',
      'Constructed from thermoplastic elastomer (TPE) enriched with medical-grade mineral oil and Vitamin E, the Classic Gel formulation features high flow and low rebound properties. The gel adapts dynamically to pressure changes while maintaining its shape over time.',
      'Below-knee liners are available in 3 mm, 6 mm, and 9 mm gel thickness options, with 3 mm thickness along the posterior (back) aspect of the liner.',
      'The locking configuration provides secure distal engagement within compatible pin-lock suspension systems.',
    ],
    features: [
      'Designed for transtibial (below-knee) prosthesis users',
      'Compatible with pin-lock suspension systems',
      'Available in 3 mm, 6 mm, and 9 mm gel thickness options',
      '3 mm posterior thickness',
      'Mineral-oil\u2013based gel with Vitamin E',
      'High-flow pressure adaptation',
      'Low rebound durability',
      'Heat moldable for prosthetic adjustment',
      'Latex-free and hypoallergenic',
      'Made in the USA',
      'Sold individually',
    ],
    fabricOptions: [
      { name: 'Original Fabric', desc: 'Smooth, durable, supportive' },
      { name: 'Spirit Fabric', desc: 'Flexible and easier to don and doff' },
      { name: 'MAX Fabric', desc: 'Abrasion-resistant and helps reduce pistoning' },
    ],
    specs: {
      'Profile': 'Below-Knee (BK)',
      'Suspension': 'Locking (pin compatible)',
      'Available Gel Thicknesses': '3 mm, 6 mm, 9 mm',
      'Posterior Thickness': '3 mm',
      'Umbrella': 'Standard \u2013 68.6 mm',
      'Gel Type': 'Mineral-oil\u2013based TPE',
    },
    measuringGuide: [
      'Measure circumference at 4 cm and 30 cm from distal end',
      'Confirm sizing and pin compatibility before ordering',
    ],
    applicationInstructions: [
      'Clean and dry limb',
      'Invert liner',
      'Center pin attachment',
      'Roll onto limb without pulling',
      'Avoid wrinkles or air pockets.',
    ],
    careInstructions: [
      'Clean daily',
      'Disinfect weekly',
      'Do not scrub',
      'Dry thoroughly before use',
    ],
    precautions: [
      'Confirm pin compatibility before ordering',
      'Do not use over open wounds',
      'Discontinue use if irritation occurs',
      'Not vacuum-approved unless specified by provider',
    ],
  },

  'EasyLiner': {
    sizingType: 'easyliner',
    overview: [
      'The EasyLiner\u00AE Prosthetic Liner is designed to provide comfort, skin protection, and dependable suspension for lower-limb prosthesis users. Engineered with a soft gel interface and durable outer fabric, the EasyLiner helps distribute pressure evenly while enhancing socket fit and daily wear comfort.',
      'The gel formulation adapts to the residual limb to help reduce localized pressure points and shear forces. Its flexible design promotes easier donning and doffing while maintaining a secure interface within the prosthetic socket.',
      'EasyLiner is available in Cushion and Locking configurations and multiple thickness options to accommodate varying user needs.',
    ],
    features: [
      'Designed for lower-limb prosthesis users',
      'Contains antioxidants effective at scavenging free radicals and hydroxyl groups \u2014 best for use on amputees with adherent scar tissue, skin irritation, sensitive skin, and diabetics',
      'Recommended for K1\u2013K4 activity levels',
      'Available in Cushion and Locking styles',
      'Multiple thickness options available',
      'Delicately conforms to the shape of the residual limb without restricting blood flow',
      'Locking version features a Reinforced Matrix to prevent distal pistoning and contain redundant tissue',
      'Indicated for delicate skin and diabetic patients',
      'High capacity to absorb vertical and shear forces',
      'Low coefficient of static friction further relieves skin stress',
      'Easy to don, even for patients with reduced manual dexterity',
      'Sold individually',
    ],
    specs: {
      'Application': 'Below-Knee (Transtibial)',
      'Suspension Options': 'Cushion or Locking (pin compatible)',
      'Available Thicknesses': '3 mm, 6 mm, 9 mm',
      'Tapered Profile': 'Available by special order',
      'Activity Level': 'K1\u2013K4',
    },
    measuringGuide: [
      'Measure the circumference of the residual limb at 6 cm above the distal end.',
    ],
    applicationInstructions: [
      'Ensure residual limb is clean and dry.',
      'Invert the liner so the gel side is facing outward.',
      'Place the distal end of the liner against the end of your limb.',
      'Roll the liner onto your limb without pulling.',
      'For locking versions, center the pin attachment before fully rolling into place.',
      'Avoid wrinkles and air pockets to ensure optimal comfort and suspension.',
    ],
    careInstructions: [
      'Clean the gel side daily using lukewarm water and a pH-balanced prosthetic cleanser',
      'Rinse thoroughly and dry with a lint-free cloth',
      'Allow liner to air dry completely before use',
      'Disinfect weekly using an alcohol-based spray as recommended by your prosthetist',
      'Do not scrub gel or fabric surfaces',
    ],
    precautions: [
      'Do not apply over open wounds or compromised skin',
      'Discontinue use if irritation, discomfort, or circulation issues occur',
      'Confirm compatibility with your suspension system prior to ordering',
      'Consult your prosthetist if unsure about thickness, profile, or fit',
    ],
  },

  'General Purpose': {
    sizingType: 'alps-gp',
    overview: [
      'The ALPS\u00AE General Purpose Prosthetic Liner is designed to provide comfortable socket fit, reliable suspension, and adaptable cushioning for a wide variety of prosthesis users. Made with ALPS Grip Gel, this liner ensures optimum adhesion while comfortably conforming to the shape of the residual limb.',
      'The softer durometer Grip Gel is engineered for easier application, making it especially suitable for individuals with reduced hand dexterity. The liner elongates and gently conforms during ambulation, helping to reduce the potential for blood flow restriction, particularly for users with circulatory concerns.',
      'The General Purpose Liner is recommended for users with low activity levels, healthy skin conditions, irregular limb shapes, and bony prominences requiring added protection.',
    ],
    features: [
      'Available for Above-Knee (AK) and Below-Knee (BK) users',
      'Conforms to the residual limb shape over time',
      'Grip Gel provides reliable adhesion between limb and prosthesis',
      'Protects bony prominences',
      'Engineered for irregularly shaped residual limbs',
      'Designed for low activity levels',
      'Soft durometer gel for easier donning',
      'Elongation properties help reduce potential blood flow restriction',
      'Available in 3 mm and 6 mm uniform thicknesses',
      'Available in Cushion and Locking configurations',
      'Premium seamless knit outer covering',
      'Beige fabric with vertical and horizontal stretch',
      'Latex-free and hypoallergenic',
      'Made in the USA',
      'Sold individually',
      'Locking pin not included',
      'Not vacuum approved as a replacement liner for vacuum suspension systems',
    ],
    gelTechnology: 'The General Purpose Liner is constructed from ALPS Grip Gel (Thermoplastic Elastomer \u2013 TPE). The tackiness of Grip Gel helps reduce bunching in the popliteal area while ensuring ideal adhesion. The gel provides softness, strength, and cushioning, helping relieve the residual limb from stress generated by vertical and shear forces.',
    fabricTechnology: 'The seamless beige knit outer fabric offers both vertical and horizontal stretch. Its superior elongation allows the liner to conform gently to the residual limb while helping minimize circulatory restriction. The durable knit construction helps extend the life of the liner.',
    suspensionOptions: [
      { name: 'Cushion Suspension', desc: 'Standard cushion configuration' },
      { name: 'Locking Suspension (Reinforced Matrix)', desc: 'Designed to help prevent distal pistoning and contain redundant tissue' },
    ],
    specs: {
      'Amputation Level': 'Above-Knee (AK) and Below-Knee (BK)',
      'Activity Level': 'Recommended for K1\u2013K4',
      'Gel Type': 'ALPS Grip Gel (TPE)',
      'Thickness Options': '3 mm or 6 mm Uniform',
      'Fabric': 'Seamless Beige Knit (vertical and horizontal stretch)',
      'Suspension': 'Cushion or Locking (Reinforced Matrix)',
      'Color': 'Beige',
    },
    measuringGuide: [
      'Measure the circumference of the residual limb at 6 cm above the distal end to determine the appropriate size.',
      'Consult your prosthetist to confirm sizing prior to ordering.',
    ],
    applicationInstructions: [
      'Ensure the residual limb is clean, dry, and free of soap residue.',
      'Invert the liner so the logo is on the inside.',
      'Place the distal end of the liner against the end of the limb.',
      'If using a locking liner, center the pin attachment.',
      'Roll the liner onto the limb without pulling.',
      'Do not pull the liner onto your limb. Pulling may stretch the skin and cause discomfort or irritation. Ensure there are no wrinkles or air pockets.',
    ],
    careInstructions: [
      'Clean gel side daily using lukewarm water and a pH-balanced prosthetic cleanser',
      'Use a soft cloth or sponge',
      'Do not scrub gel or fabric surfaces',
      'Rinse thoroughly and dry with a lint-free cloth',
      'Place liner on drying stand with logo facing outward',
      'Disinfect weekly using ethyl alcohol spray, rinse, and dry',
      'Avoid animal-based lotions or powders, as they may damage the liner',
    ],
    precautions: [
      'Do not apply over open wounds or compromised skin',
      'Discontinue use if irritation, discomfort, or circulation issues occur',
      'Do not wear for more than 20 hours per day',
      'Not indicated for individuals with skin conditions aggravated by non-porous gel materials',
      'AK users with residual limbs shorter than 3 inches should use a secondary AK belt',
    ],
  },
};

// Normalize product names for matching (Shopify uses "Above-Knee"/"Below-Knee", keys use "AK"/"BK")
function normalize(str) {
  return str
    .replace(/Above[- ]Knee/gi, 'AK')
    .replace(/Below[- ]Knee/gi, 'BK')
    .replace(/\s+Liner$/i, '')
    .replace(/Prosthetic\s+/gi, '');
}

// Find a matching description for a product by checking the base name
export function findLinerDescription(baseName) {
  if (!baseName) return null;
  const normalized = normalize(baseName);
  const entry = Object.entries(LINER_DESCRIPTIONS).find(
    ([key]) => normalized.includes(key)
  );
  return entry ? entry[1] : null;
}
