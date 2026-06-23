import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#111111",
          900: "#F8F7F3",
          800: "#F3F2EE",
          700: "#EAE8E0",
          600: "#D8D6CE",
        },
        beam: {
          DEFAULT: "#111111",
          400: "#2B2B2B",
          600: "#000000",
        },
        prism: {
          DEFAULT: "#7A8B64",
          400: "#8FA277",
          600: "#5F724C",
        },
        signal: {
          good: "#247A32",
          ok: "#2F5F9D",
          warn: "#A35B00",
          bad: "#B44135",
        },
        border: "#E7E5DE",
        input: "#E7E5DE",
        ring: "#111111",
        background: "#F8F7F3",
        foreground: "#111111",
        muted: { DEFAULT: "#F3F2EE", foreground: "#6F6F68" },
        card: { DEFAULT: "#FFFFFF", foreground: "#111111" },
      },
      borderRadius: {
        lg: "22px",
        md: "16px",
        sm: "10px",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        "matrixtype": ["MatrixTypeDisplay", "monospace"],
      },
      boxShadow: {
        glow: "0 18px 60px -36px rgba(17, 17, 17, 0.38)",
        "glow-prism": "0 24px 70px -45px rgba(95, 114, 76, 0.45)",
        card: "0 1px 0 rgba(255,255,255,0.85) inset, 0 24px 70px -48px rgba(17,17,17,0.28)",
      },
      backgroundImage: {
        "beam-gradient": "linear-gradient(120deg, #111111 0%, #3A3A35 100%)",
        "diag-grid":
          "linear-gradient(rgba(17,17,17,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,0.05) 1px, transparent 1px)",
      },
      keyframes: {
        "float-y": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "sweep": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(200%)" },
        },
        "pulse-ring": {
          "0%,100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" },
        },
      },
      animation: {
        "float-y": "float-y 6s ease-in-out infinite",
        sweep: "sweep 3.5s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
