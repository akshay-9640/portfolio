/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { paper: "#0b0f17", ink: "#e6edf3", card: "#121826", accent: "#22d3ee" },
      fontFamily: {
        serif: ['"Space Grotesk"', "Inter", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
