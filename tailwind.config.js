// tailwind.config.js

module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'primary': 'rgb(var(--color-primary))', 
        'secondary': 'rgb(var(--color-secondary))',
        'third': 'rgb(var(--color-third))',
        'button-inactive': '#acacac',
        'background-popup': '#e9e9e9',
        'primary-hover': 'rgb(var(--color-primary-hover))',
      },
      fontFamily: {
        'primary': 'var(--font-primary)',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'DEFAULT': 'var(--round-primary)',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(var(--color-primary)/ var(--alpha-05))',
        'DEFAULT': '0 1px 3px 0 rgb(var(--color-primary)/ var(--alpha-1)), 0 1px 4px -1px rgb(var(--color-primary)/ var(--alpha-1))',
        'md':'0 10px 15px -3px rgb(var(--color-primary)/ var(--alpha-1)), 0 4px 6px -4px rgb(var(--color-primary)/ var(--alpha-1))',
        'lg':'0 10px 15px -3px rgb(var(--color-primary)/ var(--alpha-1)), 0 4px 6px -4px rgb(var(--color-primary)/ var(--alpha-1))',
        'xl': '0 20px 25px -5px rgb(var(--color-primary)/ var(--alpha-1)), 0 8px 10px -6px rgb(var(--color-primary)/ var(--alpha-1))',
        '2xl': '0 25px 50px -12px rgb(var(--color-primary)/ var(--alpha-25))',
        'inner': 'inset 0 2px 4px 0 rgb(var(--color-primary)/ var(--alpha-05))',
        'none': 'none',
      },
      backgroundImage: {
        'image-primary': "var(--background-image)",
      },
    },
  },
  variants: {
    extend: {
      borderWidth: ['hover', 'focus', 'group-hover'],
    },
  },
  plugins: [],
}
