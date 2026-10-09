import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-3": "var(--ink-3)",
        primary: {
          DEFAULT: "var(--primary)",
          700: "var(--primary-700)",
          50: "var(--primary-50)",
        },
        violet: {
          DEFAULT: "var(--violet)",
          50: "var(--violet-50)",
        },
        pink: {
          DEFAULT: "var(--pink)",
          50: "var(--pink-50)",
        },
        canvas: "var(--canvas)",
        surface: {
          DEFAULT: "var(--surface)",
          2: "var(--surface-2)",
        },
        line: "var(--line)",
        success: "var(--success)",
        alarm: "var(--alarm)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      fontSize: {
        display: ["32px", { lineHeight: "1.2", fontWeight: "600" }],
        h1: ["24px", { lineHeight: "1.2", fontWeight: "600" }],
        h2: ["18px", { lineHeight: "1.3", fontWeight: "500" }],
        body: ["15px", { lineHeight: "1.5", fontWeight: "400" }],
        small: ["13px", { lineHeight: "1.5", fontWeight: "400" }],
        micro: ["11.5px", { lineHeight: "1.4", fontWeight: "500", letterSpacing: "0.06em" }],
      },
      borderRadius: {
        card: "10px",
        control: "8px",
        pill: "999px",
      },
      boxShadow: {
        float: "0 1px 2px rgba(11,43,47,.04), 0 4px 12px rgba(11,43,47,.06)",
      },
      transitionTimingFunction: {
        quint: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
