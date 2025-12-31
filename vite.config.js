import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['pwa-192x192.png', 'pwa-512x512.png'],
            manifest: {
                name: 'My Crochet Kit - Track, Price & Sell Your Crochet Projects',
                short_name: 'My Crochet Kit',
                description: 'The only crochet app that tracks your progress, calculates fair pricing, and helps you sell with 0% commission. Voice control, pattern library, and more.',
                theme_color: '#7C3AED',
                background_color: '#FFFFFF',
                display: 'standalone',
                orientation: 'any',
                scope: '/',
                start_url: '/',
                categories: ['lifestyle', 'productivity', 'shopping'],
                icons: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                navigateFallbackDenylist: [/^\/api/],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'gstatic-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    }
                ]
            },
            devOptions: {
                enabled: true
            }
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage', 'firebase/analytics'],
                    'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-switch', '@radix-ui/react-tabs', '@radix-ui/react-toast'],
                    'db-vendor': ['dexie', 'zustand']
                }
            }
        },
        target: 'es2022',
        sourcemap: true
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', 'firebase/app', 'dexie', 'zustand']
    },
    server: {
        proxy: {
            '/api/lifetime-checkout': {
                target: 'https://lifetimepurchase-2j4mqqqvaa-uc.a.run.app',
                changeOrigin: true,
                rewrite: function () { return ''; }
            }
        }
    }
});
