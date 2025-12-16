import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config with React plugin and proxy to Pyramid backend during development
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_BACKEND_URL || 'http://localhost:6543';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        // Forward API calls to Pyramid dev server
        '/api': {
          target,
          changeOrigin: true,
        },
      },
    },
  };
});
