import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': '/src' } },
  server: {
    proxy: {
      '/api': {
        target: 'https://script.google.com',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/api/, '/macros/s/AKfycbxFvMQbrubTemitq85glm9mMb5kv0ws4Z07RzDEWysJpnEB2ZqY78BZr3hM5XME-LDX/exec'),
      },
    },
  },
})
