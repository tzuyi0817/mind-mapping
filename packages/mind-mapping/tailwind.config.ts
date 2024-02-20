import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: ['./styles/*.css'],
  theme: {
    screens: {
      ...defaultTheme.screens,
    },
    extend: {},
  },
};

export default config;
