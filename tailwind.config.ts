import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        celo: {
          yellow: '#FCFF52',
          dark: '#1A1A1A',
        },
      },
    },
  },
  plugins: [],
};
export default config;
