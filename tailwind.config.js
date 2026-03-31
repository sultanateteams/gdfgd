/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-light': 'var(--primary-light)',
        accent: 'var(--accent)',
        'sidebar-bg': 'var(--sidebar-bg)',
        'header-bg': 'var(--header-bg)',
        'body-bg': 'var(--body-bg)',
        'card-bg': 'var(--card-bg)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted, var(--text-secondary))',
        'border-color': 'var(--border-color)',
        'sidebar-text': 'var(--sidebar-text)',
        'sidebar-text-hover': 'var(--sidebar-text-hover)',
        'sidebar-hover-bg': 'var(--sidebar-hover-bg)',
        'sidebar-active-bg': 'var(--sidebar-active-bg)',
        'sidebar-group-label': 'var(--sidebar-group-label)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        info: 'var(--accent)',
      },
    },
  },
  plugins: [],
}
