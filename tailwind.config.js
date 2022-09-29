const {colors} = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    colors: {
      transparent: 'transparent',
      white: '#FFFFFF',
      black: '#000000',
      primary: colors.indigo,
      medb: {
        base: '#4BC0C0',
        light: '#84e8e8'
      },
      neutral: {
        100: '#F7FAFC',
        200: '#EDF2F7',
        300: '#E2E8F0',
        400: '#CBD5E0',
        500: '#A0AEC0',
        600: '#718096',
        700: '#4A5568',
        800: '#2D3748',
        900: '#1A202C',
      },
      success: {
        'dark': '#276749',
        'base': '#48BB78',
        'light': '#9AE6B4',
      },
      warning: {
        'dark': '#D69E2E',
        'base': '#ECC94B',
        'light': '#F6E05E',
      },
      error: {
        'dark': '#9B2C2C',
        'base': '#F56565',
        'DEFAULT': '#F56565',
        'light': '#FEB2B2',
        'lighter': '#FED7D7',
      },
      info: {
        'dark': '#2C5282',
        'base': '#4299E1',
        'DEFAULT': '#4299E1',
        'light': '#BEE3F8',
        'lighter': '#BEE3F8'
      },
    },
    fontFamily: {
      'display': ['Comfortaa', 'sans-serif'],
      'body': ['Open Sans', 'sans-serif']
    },
    screens: {
      'xl': {'max': '1279px'},
      'lg': {'max': '1023px'},
      'md': {'max': '767px'},
      'sm': {'max': '639px'},
      'xs': {'max': '425px'},
    },
    extend: {
      width: {
        96: '24rem',
        120: '30rem',
        144: '36rem'
      },
      height: {
        100: '20rem'
      },
      zIndex: {
        '1': '1',
        '2': '2',
        '100': '100'
      },
      margin: {160: '40rem'},
      order: {
        '50': '50'
      }
    }
  },
  variants: {
    borderWidth: ['responsive', 'hover', 'focus']
  },
  plugins: [
    require('@tailwindcss/typography'),
  ]
}
