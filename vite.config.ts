/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// BASE_PATH lehetővé teszi a GitHub Pages alútvonalon történő telepítést (pl. /musclelab/).
const base = process.env.BASE_PATH ?? './';

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon.svg'],
      manifest: {
        name: 'Myo – interaktív anatómia és biomechanika',
        short_name: 'Myo',
        description: 'Interaktív anatómiai és biomechanikai oktatási alkalmazás',
        lang: 'hu',
        theme_color: '#171419',
        background_color: '#171419',
        display: 'standalone',
        start_url: '.',
        scope: '.',
        icons: [
          { src: 'icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icons/icon-maskable.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: 'index.html'
      }
    })
  ],
  test: {
    environment: 'jsdom',
    include: ['src/tests/**/*.test.{ts,tsx}']
  }
});
