import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import {VitePluginRadar} from "vite-plugin-radar";

export default defineConfig({
  plugins: [
      react(),
      VitePluginRadar({
        analytics: {
          id: process.env.VITE_G_TAG ?? ''
        }
      }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
