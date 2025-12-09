/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background Colors
        'bg-main': '#F4F9F4',
        'bg-sidebar': '#FFFFFF',
        'bg-navbar': '#FFFFFF',
        'bg-card': '#FFFFFF',
        
        // Text Colors
        'text-primary': '#0F172A',
        'text-secondary': '#475569',
        'text-muted': '#64748B',
        
        // Border & Divider
        'border-color': '#E2E8F0',
        
        // Chart Colors
        'chart-blue': '#2563EB',
        'chart-green': '#16A34A',
        'chart-red': '#F43F5E',
        'chart-cyan': '#0EA5E9',
        'chart-lime': '#22C55E',
        
        // Sport Theme
        'sport-green': '#16A34A',
        'sport-green-light': '#E8F5E9',
        'sport-blue': '#2563EB',
      },
    },
  },
  plugins: [],
}
