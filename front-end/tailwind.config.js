/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
        extend: {
          keyframes: {
            "slide-up": {
              "0%": { transform: "translateY(100px)", opacity: "0" },
              "100%": { transform: "translateY(0)", opacity: "1" },
            },
            "fade-in": {
              "0%": { opacity: "0" },
              "100%": { opacity: "1" },
            },
            "float": {
              "0%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-15px)" },
              "100%": { transform: "translateY(0)" },
            },
          },
          animation: {
            "slide-up": "slide-up 1s ease-out",
            "fade-in": "fade-in 1s ease-out",
            "float": "float 3s infinite ease-in-out",
          },
        }
  },
  plugins: [],
}

