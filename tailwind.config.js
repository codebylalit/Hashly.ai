/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#2C3E50',
          light: '#34495E',
          dark: '#1A252F',
        },
        background: {
          main: '#FCFBF1',
          card: '#FFFFFF',
          modal: '#1E293B',
        },
        accent: {
          sage: '#503D3F',
          beige: '#C7A59D',
          orange: '#66B2B2',
          olive: '#5D8472',
          deepGreen: '#3B5C3A',
          teal: '#66B2B2',
        },
        text: {
          primary: '#2C3E50',
          secondary: '#34495E',
          light: '#FFFFFF',
          muted: '#94A3B8',
        },
        status: {
          success: '#34D399',
          warning: '#FBBF24',
          error: '#EF4444',
          info: '#60A5FA',
        },
        border: {
          light: '#E2E8F0',
          dark: '#CBD5E1',
        },
        shadow: {
          light: 'rgba(0, 0, 0, 0.1)',
          dark: 'rgba(0, 0, 0, 0.2)',
        },
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '0.1' },
          '50%': { opacity: '0.2' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.1' },
          '50%': { opacity: '0.15' },
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'pulse': 'pulse 4s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 6s ease-in-out infinite',
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
