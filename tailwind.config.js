const { hairlineWidth } = require("nativewind/theme");

// Set TARGET to "native" when building for native platforms.
// You can set process.env.TARGET via your build scripts.
const isNative = process.env.TARGET === "native";

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: isNative
                ? {
                      // Explicit color values for native:
                      border: "#d2e7d6",
                      input: "#d2e7d6",
                      ring: "#2a3e34",
                      background: "#e8f4ea", // light: formerly background
                      foreground: "#2a3e34",
                      primary: {
                          DEFAULT: "#e0f0e3",
                          foreground: "#2a3e34",
                      },
                      secondary: {
                          DEFAULT: "#b8d8be",
                          foreground: "#2a3e34",
                      },
                      destructive: {
                          DEFAULT: "#d9534f", // choose an explicit destructive color
                          foreground: "#fff",
                      },
                      muted: {
                          DEFAULT: "#d2e7d6",
                          foreground: "#2a3e34",
                      },
                      accent: {
                          DEFAULT: "#b8d8be",
                          foreground: "#2a3e34",
                      },
                      popover: {
                          DEFAULT: "#e8f4ea", // same as background
                          foreground: "#2a3e34",
                      },
                      card: {
                          DEFAULT: "#c8e1cc", // formerly card (#c8e1cc) becomes explicit
                          foreground: "#2a3e34",
                      },
                  }
                : {
                      // Use CSS variables for web (from your global.css)
                      border: "hsl(var(--border))",
                      contrastText: "hsl(var(--contrast-text))",
                      input: "hsl(var(--input))",
                      ring: "hsl(var(--ring))",
                      background: "hsl(var(--background))",
                      foreground: "hsl(var(--foreground))",
                      primary: {
                          DEFAULT: "hsl(var(--primary))",
                          foreground: "hsl(var(--primary-foreground))",
                      },
                      secondary: {
                          DEFAULT: "hsl(var(--secondary))",
                          foreground: "hsl(var(--secondary-foreground))",
                      },
                      destructive: {
                          DEFAULT: "hsl(var(--destructive))",
                          foreground: "hsl(var(--destructive-foreground))",
                      },
                      muted: {
                          DEFAULT: "hsl(var(--muted))",
                          foreground: "hsl(var(--muted-foreground))",
                      },
                      accent: {
                          DEFAULT: "hsl(var(--accent))",
                          foreground: "hsl(var(--accent-foreground))",
                      },
                      popover: {
                          DEFAULT: "hsl(var(--popover))",
                          foreground: "hsl(var(--popover-foreground))",
                      },
                      card: {
                          DEFAULT: "hsl(var(--card))",
                          foreground: "hsl(var(--card-foreground))",
                      },
                  },
            borderWidth: {
                hairline: hairlineWidth(),
            },
            fontFamily: {
                sans: ["Comfortaa_400Regular"],
                light: ["Comfortaa_300Light"],
                medium: ["Comfortaa_500Medium"],
                semibold: ["Comfortaa_600SemiBold"],
                bold: ["Comfortaa_700Bold"],
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
