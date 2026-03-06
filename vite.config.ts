import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
   plugins: [react(), tailwindcss()],
   build: {
      rollupOptions: {
         output: {
            manualChunks: {
               react: ['react', 'react-dom', 'react-router-dom'],
               mui: ['@mui/material', '@emotion/react', '@emotion/styled'],
               charts: ['@mui/x-charts'],
               lottie: ['@lottiefiles/dotlottie-react'],
            },
         },
      },
   },
});
