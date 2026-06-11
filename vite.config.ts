import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load all environment variables
  const env = loadEnv(mode, path.resolve('.'), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      port: 3000,
      strictPort: true,
    },
    // FIX: process.env must be defined as an object containing specific keys.
    // Defining 'process.env': {} LAST was overriding the specific keys above it.
    define: {
      'process.env': {
        API_KEY: env.API_KEY || '',
        OPENROUTER_API_KEY: env.OPENROUTER_API_KEY || '',
      }
    },
    build: {
      // Vercel-compatible chunking — suppress chunk size warning
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/@supabase')) {
              return 'vendor-supabase';
            }
          }
        }
      }
    }
  };
});
