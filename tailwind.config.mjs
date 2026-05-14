/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Brand */
        brand: {
          700: "#0B5D63",
          600: "#10797F",
          500: "#1B9AA0",
          200: "#B8DDDF",
          50:  "#ECF6F6",
        },
        /* Accent */
        accent: {
          600: "#C58A2A",
          100: "#F6ECD2",
        },
        /* Neutrals */
        paper:    "#FAF8F4",
        surface:  "#FFFFFF",
        surface2: "#F2EFE8",
        ink: {
          900: "#171513",
          700: "#3D3934",
          500: "#6E6862",
          300: "#B6B0A8",
          100: "#E8E3DA",
        },
        /* Semantic */
        success:    "#147651",
        successBg:  "#E6F4EC",
        warning:    "#9A6700",
        warningBg:  "#FBF1D7",
        danger:     "#B42318",
        dangerBg:   "#FBEAE8",
        /* Legacy compat */
        primary: "#10797F",
      },
      fontFamily: {
        sans:    ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        mono:    ["Geist Mono", "ui-monospace", "SF Mono", "monospace"],
        display: ["Instrument Serif", "Iowan Old Style", "Georgia", "serif"],
      },
      borderRadius: {
        xs:   "4px",
        sm:   "8px",
        md:   "12px",
        lg:   "20px",
        pill: "999px",
      },
      boxShadow: {
        1: "0 1px 0 oklch(0% 0 0 / 0.04), 0 1px 2px oklch(0% 0 0 / 0.04)",
        2: "0 2px 4px oklch(0% 0 0 / 0.04), 0 6px 12px oklch(0% 0 0 / 0.06)",
        3: "0 4px 8px oklch(0% 0 0 / 0.05), 0 16px 32px oklch(0% 0 0 / 0.08)",
        4: "0 8px 16px oklch(0% 0 0 / 0.06), 0 32px 64px oklch(0% 0 0 / 0.12)",
        focus: "0 0 0 3px oklch(62% 0.12 195 / 0.35)",
      },
      maxWidth: {
        content: "1240px",
      },
      transitionTimingFunction: {
        "ease-out-expo": "cubic-bezier(0.22, 1, 0.36, 1)",
        "ease-spring":   "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};
