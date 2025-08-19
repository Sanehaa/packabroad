import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        oxford: "#00213F",
        aero: "#5EBDDC",
        caramel: "#D48346",
        tawny: "#CE5E22",
        "process-cyan": "#41ADD6",
        lightblue: "#AECECE",
      },
    },
  },
  plugins: [],
}
export default config
