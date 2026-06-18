import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Where /api gets proxied. Defaults to the deployed backend (VITE_BACKEND_URL);
  // point it at http://127.0.0.1:8000 to test against a local backend instead.
  const apiTarget = env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  return {
    plugins: [
      react(),
      tailwindcss(), // ✅ this is correct
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      // Accept requests coming through a tunnel (cloudflared / ngrok) so the
      // app can be opened on a phone over HTTPS.
      allowedHosts: true,
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (p) => p.replace(/^\/api/, ""),
        },
      },
    },
  };
});
