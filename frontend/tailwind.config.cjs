// tailwind.config.cjs
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // FIFA-inspired Tournament Palette (Blue, White, Green)
        fifa: {
          darkNavy: "#070E24",       // Deep stadium night background
          navy: "#0A1435",           // Card backgrounds in dark mode
          blue: "#0A5CFF",           // Electric match blue (primary)
          ocean: "#0043C6",          // Secondary deep blue
          pitch: "#00C853",          // Match pitch green (accent)
          green: "#009E49",          // Deeper emerald green
          sky: "#38BDF8",            // Highlight cyan
          glassDark: "rgba(10, 20, 53, 0.65)",  // Glassmorphic dark card
          glassLight: "rgba(255, 255, 255, 0.75)", // Glassmorphic light card
        },
        dark: {
          bg: "#070E24",
          card: "#0A1435",
          border: "#172A5C",
          text: "#F8FAFC",
          muted: "#94A3B8",
        },
        light: {
          bg: "#F8FAFC",
          card: "#FFFFFF",
          border: "#E2E8F0",
          text: "#0F172A",
          muted: "#64748B",
        },
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      backgroundImage: {
        "fifa-pitch-gradient": "linear-gradient(135deg, #0A5CFF 0%, #00C853 100%)",
        "fifa-blue-gradient": "linear-gradient(135deg, #0A5CFF 0%, #0043C6 100%)",
        "fifa-green-gradient": "linear-gradient(135deg, #00C853 0%, #009E49 100%)",
        "fifa-glass-dark": "linear-gradient(135deg, rgba(10, 20, 53, 0.6) 0%, rgba(7, 14, 36, 0.8) 100%)",
      },
      boxShadow: {
        "fifa-glow": "0 0 15px rgba(10, 92, 255, 0.25)",
        "pitch-glow": "0 0 15px rgba(0, 200, 83, 0.25)",
      }
    },
  },
  plugins: [],
};
