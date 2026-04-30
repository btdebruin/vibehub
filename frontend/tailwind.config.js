/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        vh: {
          bg: '#0A0A0F',
          surface: 'rgba(255,255,255,0.04)',
          'surface-hover': 'rgba(255,255,255,0.08)',
          border: 'rgba(255,255,255,0.08)',
          'border-bright': 'rgba(255,255,255,0.15)',
        },
      },
      borderRadius: {
        card: '20px',
        logo: '12px',
        btn: '10px',
        input: '10px',
        palette: '16px',
      },
    },
  },
  plugins: [],
};
