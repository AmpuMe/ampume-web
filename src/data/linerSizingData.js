// Sizing chart data for prosthetic liners
// Each liner in linerDescriptions.js references a sizingType that maps to an entry here

export const SIZING_CHARTS = {
  'alpha-ak': {
    title: 'Alpha Classic AK Sizing',
    measurementMethod: 'dual-circumference',
    measurementImage: '/images/sizing/ak-measurement-guide.png',
    measurementPoints: [
      {
        label: 'Distal Measurement',
        distance: '4 cm (1.5 in)',
        description: 'Measure the circumference of your residual limb 4 cm (1.5 inches) from the end.',
      },
      {
        label: 'Proximal Measurement',
        distance: '30 cm (12 in)',
        description: 'Measure the circumference 30 cm (12 inches) from the end of your residual limb.',
      },
    ],
    sizes: [
      { label: 'M+', name: 'Medium Plus', proximal: [34, 54], distal: [20, 32], proximalIn: [13.5, 21.5], distalIn: [8, 12.5] },
      { label: 'L', name: 'Large', proximal: [37, 64], distal: [28, 36], proximalIn: [14.5, 25], distalIn: [11, 14] },
      { label: 'L+', name: 'Large Plus', proximal: [44, 80], distal: [32, 47], proximalIn: [17.5, 31.5], distalIn: [12.5, 18.5] },
      { label: 'XL', name: 'Extra Large', proximal: [48, 90], distal: [37, 55], proximalIn: [19, 35.5], distalIn: [14.5, 22] },
    ],
    columns: [
      { key: 'label', header: 'Size' },
      { key: 'distal', header: 'Distal (4 cm)' },
      { key: 'proximal', header: 'Proximal (30 cm)' },
    ],
    globalMin: 8,
    globalMax: 90,
  },

  'alpha-bk': {
    title: 'Alpha Classic BK Sizing',
    measurementMethod: 'dual-circumference',
    measurementImage: '/images/sizing/bk-measurement-guide.png',
    measurementPoints: [
      {
        label: 'Distal Measurement',
        distance: '4 cm (1.5 in)',
        description: 'Measure the circumference of your residual limb 4 cm (1.5 inches) from the end.',
      },
      {
        label: 'Proximal Measurement',
        distance: '30 cm (12 in)',
        description: 'Measure the circumference 30 cm (12 inches) from the end of your residual limb.',
      },
    ],
    sizes: [
      { label: 'S', name: 'Small', proximal: [20, 27], distal: [15, 22], proximalIn: [8, 10.5], distalIn: [6, 8.5] },
      { label: 'M', name: 'Medium', proximal: [23, 36], distal: [18, 26], proximalIn: [9, 14], distalIn: [7, 10] },
      { label: 'M+', name: 'Medium Plus', proximal: [33, 50], distal: [20, 28], proximalIn: [13, 20], distalIn: [8, 11] },
      { label: 'L', name: 'Large', proximal: [36, 55], distal: [28, 33], proximalIn: [14, 21.5], distalIn: [10, 13] },
      { label: 'L+', name: 'Large Plus', proximal: [40, 60], distal: [28, 40], proximalIn: [15.5, 23.5], distalIn: [11, 15.5] },
      { label: 'XL', name: 'Extra Large', proximal: [43, 65], distal: [33, 45], proximalIn: [17, 25.5], distalIn: [13, 17.5] },
    ],
    columns: [
      { key: 'label', header: 'Size' },
      { key: 'distal', header: 'Distal (4 cm)' },
      { key: 'proximal', header: 'Proximal (30 cm)' },
    ],
    globalMin: 6,
    globalMax: 65,
  },

  'easyliner': {
    title: 'EasyLiner Sizing',
    measurementMethod: 'single-circumference',
    measurementImage: '/images/sizing/single-measurement-guide.png',
    measurementImageAK: '/images/sizing/ak-single-measurement-guide.png',
    measurementPoints: [
      {
        label: 'Circumference',
        distance: '6 cm',
        description: 'Measure the circumference of your residual limb 6 cm above the distal end.',
      },
    ],
    sizes: [
      { label: '10', circumference: [10, 15] },
      { label: '16', circumference: [16, 19] },
      { label: '20', circumference: [20, 23] },
      { label: '24', circumference: [24, 25] },
      { label: '26', circumference: [26, 27] },
      { label: '28', circumference: [28, 31] },
      { label: '32', circumference: [32, 34] },
      { label: '35', circumference: [35, 37] },
      { label: '38', circumference: [38, 43] },
      { label: '44', circumference: [44, 53] },
    ],
    columns: [
      { key: 'label', header: 'Size' },
      { key: 'circumference', header: 'Circumference at 6 cm' },
    ],
    note: 'Each size is available in Locking and/or Cushion configurations with multiple thickness options.',
    globalMin: 10,
    globalMax: 53,
  },

  'alps-gp': {
    title: 'ALPS General Purpose Sizing',
    measurementMethod: 'single-circumference',
    measurementImage: '/images/sizing/single-measurement-guide.png',
    measurementImageAK: '/images/sizing/ak-single-measurement-guide.png',
    measurementPoints: [
      {
        label: 'Circumference',
        distance: '6 cm',
        description: 'Measure the circumference of your residual limb 6 cm above the distal end.',
      },
    ],
    sizes: [
      { label: '16', circumference: [16, 19] },
      { label: '20', circumference: [20, 23] },
      { label: '24', circumference: [24, 27] },
      { label: '28', circumference: [28, 31] },
      { label: '32', circumference: [32, 37] },
      { label: '38', circumference: [38, 43] },
      { label: '44', circumference: [44, 53] },
    ],
    columns: [
      { key: 'label', header: 'Size' },
      { key: 'circumference', header: 'Circumference at 6 cm' },
    ],
    note: 'Available in 3 mm and 6 mm uniform thickness. Cushion and Locking configurations.',
    globalMin: 16,
    globalMax: 53,
  },

  'sock-bk': {
    title: 'Prosthetic Sock Sizing (Below-Knee)',
    measurementMethod: 'single-circumference',
    measurementImage: '/images/sizing/bk-measurement-guide.png',
    measurementPoints: [
      {
        label: 'Width Measurement',
        distance: '5 cm',
        description: 'Measure the circumference of your residual limb 5 cm from the distal end to determine width (narrow, regular, or wide).',
      },
    ],
    sizes: [
      { label: 'Narrow', circumference: [0, 25] },
      { label: 'Regular', circumference: [25, 35] },
      { label: 'Wide', circumference: [35, 50] },
    ],
    columns: [
      { key: 'label', header: 'Width' },
      { key: 'circumference', header: 'Circumference at 5 cm' },
    ],
    note: 'For length: BK socks should extend 2-3 inches above the kneecap. Available in Lightweight (1-ply), 3-Ply, and 5-Ply.',
    globalMin: 0,
    globalMax: 50,
  },

  'sleeve-bk': {
    title: 'Suspension Sleeve Sizing (Below-Knee)',
    measurementMethod: 'single-circumference',
    measurementImage: '/images/sizing/bk-measurement-guide.png',
    measurementPoints: [
      {
        label: 'Kneecap Circumference',
        distance: 'Around kneecap',
        description: 'Measure the circumference around your kneecap (patella) to determine your sleeve size.',
      },
    ],
    sizes: [
      { label: 'Small', circumference: [30, 36] },
      { label: 'Medium', circumference: [36, 42] },
      { label: 'Large', circumference: [42, 48] },
      { label: 'X-Large', circumference: [48, 55] },
    ],
    columns: [
      { key: 'label', header: 'Size' },
      { key: 'circumference', header: 'Kneecap Circumference' },
    ],
    note: 'ProFlex sleeves are designed for below-knee prosthetic suspension only. Compatible with valve, DVS, and Harmony systems.',
    globalMin: 30,
    globalMax: 55,
  },
};

export function getSizingChart(sizingType) {
  return SIZING_CHARTS[sizingType] || null;
}
