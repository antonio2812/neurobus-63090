import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa'; // Importando VitePWA

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    // Configuração PWA
    VitePWA({
      registerType: 'autoUpdate',
      // Inclui todos os assets relevantes para cache
      includeAssets: [
        'favicon.ico', 
        'robots.txt', 
        'lovable-uploads/*.png', 
        'lovable-uploads/*.jpeg', 
        'lovable-uploads/*.jpg', 
        'lovable-uploads/*.webp',
        'lovable-uploads/*.svg',
      ],
      manifest: {
        name: 'LucraAI - Precificação com IA',
        short_name: 'LucraAI',
        description: 'IA que Multiplica seu Lucro',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/lovable-uploads/LogoMarca LucraAI 02.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/lovable-uploads/LogoMarca LucraAI 02.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/lovable-uploads/LogoMarca LucraAI 02.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      devOptions: {
        enabled: true
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));