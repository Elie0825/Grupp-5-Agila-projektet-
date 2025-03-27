import { defineConfig } from "vite"; // Importerar Vites konfigurationsfunktion
import react from "@vitejs/plugin-react"; // Importerar React-pluginen för Vite

// Exporterar Vite-konfigurationen
export default defineConfig({
  plugins: [react()], // Aktiverar React-stöd för Vite
  server: {
    proxy: {
      // Alla anrop som börjar med "/api" omdirigeras till det externa API:et
      "/api": {
        target: "http://localhost:3001", // Den riktiga API-adressen
        changeOrigin: true,
        // true gör att proxyn använder API:ets domän som "host" i 
        // anropet, istället för localhost.

      },
    },
  },
});