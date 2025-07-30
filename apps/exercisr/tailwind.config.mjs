import { createGlobPatternsForDependencies } from '@nx/angular/tailwind';
import { join } from 'path';

import preset from '../../tailwind.config.mjs';

/** @type {import('tailwindcss').Config} */
const config = {
  presets: [preset],
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    'libs/**/*.{html,ts,mjs,js}',
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
