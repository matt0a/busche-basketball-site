/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#009FFD",
                charcoal: "#264653",
                aqua: "#2AFC98",
            },
        },
    },
    plugins: [],
};
