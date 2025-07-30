import PrimeUI from 'tailwindcss-primeui';

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./apps/**/*.{html,ts,mjs,js}', './libs/**/*.{html,ts,mjs,js}'],
  theme: {
    screens: {
      sm: '576px',
      md: '768px',
      mdx: '961px',
      lg: '992px',
      xlg: '1125px',
      xl: '1200px',
      '2xl': '1920px',
    },
  },
  darkMode: ['selector', '[class*="app-dark"]'],
  plugins: [PrimeUI],
};

export default config;
