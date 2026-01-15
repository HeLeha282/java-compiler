import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env variables
  // Fix: Cast process to any to avoid TypeScript error regarding missing 'cwd' on global Process type
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    // Base path './' ensures assets are loaded correctly on GitHub Pages subpaths
    base: './',
    define: {
      // Replaces process.env.API_KEY in the code with the actual key during build
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    build: {
      outDir: 'dist',
    }
  };
});