/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          purple: '#5D00EF',
          orange: '#FF9A00',
          light: '#F5F5F7',
          dark: '#1A1A1A'
        },
        accent: {
          purple: '#7B3FFF',
          orange: '#FFB443',
          blue: '#00B2FF',
          pink: '#FF3D9A'
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #5D00EF 0%, #FF9A00 100%)',
        'gradient-hover': 'linear-gradient(135deg, #7B3FFF 0%, #FFB443 100%)',
        'gradient-active': 'linear-gradient(135deg, #4B00BF 0%, #FF8500 100%)',
      },
      animation: {
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        }
      }
    },
  },
  plugins: [],
}
