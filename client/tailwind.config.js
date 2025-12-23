/** @type {import('tailwindcss').Config} */
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
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
