/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}",
        "./**/*.{js,ts,jsx,tsx}" // Fallback for root files like App.tsx if they are in root
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
