/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./App.tsx",
        "./index.tsx",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}",
        "./utils/**/*.{js,ts,jsx,tsx}",
        "./hooks/**/*.{js,ts,jsx,tsx}",
        "./**/*.{js,ts,jsx,tsx}"
    ],
    darkMode: ['class', '[data-theme="dark"]'],
    theme: {
        extend: {
            colors: {
                onyx: {
                    50: 'rgb(var(--color-onyx-50) / <alpha-value>)',
                    100: 'rgb(var(--color-onyx-100) / <alpha-value>)',
                    200: 'rgb(var(--color-onyx-200) / <alpha-value>)',
                    300: 'rgb(var(--color-onyx-300) / <alpha-value>)',
                    400: 'rgb(var(--color-onyx-400) / <alpha-value>)',
                    500: 'rgb(var(--color-onyx-500) / <alpha-value>)',
                    600: 'rgb(var(--color-onyx-600) / <alpha-value>)',
                    700: 'rgb(var(--color-onyx-700) / <alpha-value>)',
                    800: 'rgb(var(--color-onyx-800) / <alpha-value>)',
                    900: 'rgb(var(--color-onyx-900) / <alpha-value>)',
                    950: 'rgb(var(--color-onyx-950) / <alpha-value>)',
                },
                indigo: {
                    primary: 'rgb(var(--color-indigo-primary) / <alpha-value>)',
                    soft: 'rgb(var(--color-indigo-soft) / <alpha-value>)',
                }
            },
            borderRadius: {
                'onyx': '24px'
            }
        },
    },
    plugins: [],
}
