import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#0f172a',
          700: '#1e293b',
          500: '#334155'
        }
      }
    }
  },
  plugins: []
};

export default config;
