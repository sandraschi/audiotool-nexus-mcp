import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Ports from WEBAPP_PORTS.md — next available pair: 10900 / 10901
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    allowedHosts: ['goliath'],
    port: 10900,
    strictPort: true,
  },
  preview: {
    port: 10900,
    strictPort: true,
  },
});
