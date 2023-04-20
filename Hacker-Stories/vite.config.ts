import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// missing ts type def ?

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
  },
});
