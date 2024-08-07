/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        "430": "430px",
      },
      height: {
        "370": "370px",
      },
      top: {
        "99": "96px",
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}