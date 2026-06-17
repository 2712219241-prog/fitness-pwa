import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';

const appBase = process.env.VITE_BASE_PATH ?? '/';
const normalizedBase = appBase.endsWith('/') ? appBase : `${appBase}/`;
const withBase = (path: string) => `${normalizedBase}${path}`;

export default defineConfig({
  base: normalizedBase,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: '个人健身记录',
        short_name: '健身记录',
        description: '个人力量、爬坡和身体数据记录工具',
        lang: 'zh-CN',
        theme_color: '#f47416',
        background_color: '#f8f7f3',
        display: 'standalone',
        start_url: normalizedBase,
        scope: normalizedBase,
        icons: [
          {
            src: withBase('icon.svg'),
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    exclude: ['node_modules/**', 'dist/**', '.worktrees/**'],
    globals: true
  }
});
