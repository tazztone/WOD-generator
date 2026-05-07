import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
    plugins: [
        react(),
        viteImagemin({
            gifsicle: { optimizationLevel: 7, interlaced: false },
            optipng: { optimizationLevel: 7 },
            mozjpeg: { quality: 20 },
            pngquant: { quality: [0.8, 0.9], speed: 4 },
            svgo: {
                plugins: [
                    { name: 'removeViewBox' },
                    { name: 'removeEmptyAttrs', active: false },
                ],
            },
        }),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.png', 'apple-touch-icon.png', 'mask-icon.svg'],
            manifest: {
                name: 'WOD Gen Ultimate',
                short_name: 'WOD Gen',
                description: 'Professional CrossFit Workout Generator & Timer',
                theme_color: '#0f172a',
                background_color: '#0f172a',
                display: 'standalone',
                orientation: 'portrait',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            }
        })
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom')) {
                            return 'react-vendor';
                        }
                        if (id.includes('lucide-react')) {
                            return 'lucide';
                        }
                        if (id.includes('@capacitor')) {
                            return 'capacitor';
                        }
                        return 'vendor';
                    }
                }
            },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.js',
    },
});
