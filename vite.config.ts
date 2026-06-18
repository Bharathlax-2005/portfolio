import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // When running `vercel dev` separately this isn't needed,
      // but if you only run `npm run dev`, point API calls at a
      // locally running `vercel dev` instance on port 3000.
      "/api": "http://localhost:3000",
    },
  },
});
