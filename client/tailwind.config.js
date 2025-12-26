/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#00E5FF',     // Neon Cyan
                background: '#0B0F19',  // Deep Space
                surface: '#111827',     // Surface
                secondary: '#0044CC',   // Deep Blue (kept for gradients)
                'text-main': '#FFFFFF',
                'text-muted': '#9CA3AF',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'glow': '0 0 20px rgba(0, 229, 255, 0.5)',
                'glow-lg': '0 0 40px rgba(0, 229, 255, 0.6)',
            },
        },
    },
    plugins: [
        plugin(function({ addUtilities }) {
            addUtilities({
                '.text-glow': {
                    'text-shadow': '0 0 10px rgba(0, 229, 255, 0.8), 0 0 20px rgba(0, 229, 255, 0.6)',
                },
                '.shadow-glow': {
                    'box-shadow': '0 0 20px rgba(0, 229, 255, 0.5)',
                },
            });
        }),
    ],
}
