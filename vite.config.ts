import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import { createAalimaMiddleware } from './server/aalima-handler';

dotenv.config({ path: '.env.local' });
dotenv.config();

import fs from 'fs';

// Helper to copy period icons
try {
  const srcDir = 'C:\\Users\\Hafiz\\Downloads\\Compressed\\Untitled design';
  const destDir = path.resolve(__dirname, 'public/icons/period');
  if (fs.existsSync(srcDir)) {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    const files = ['1.svg', '3.svg', '2.svg', '5.svg'];
    files.forEach(f => {
      const srcFile = path.join(srcDir, f);
      const destFile = path.join(destDir, f);
      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, destFile);
      }
    });
  }
} catch (e) {
  console.error('Error copying icons:', e);
}

// Helper to copy default icons
try {
  const rootSrcDir = 'C:\\Users\\Hafiz\\Downloads';
  const rootDestDir = path.resolve(__dirname, 'public/icons/default');
  if (!fs.existsSync(rootDestDir)) {
    fs.mkdirSync(rootDestDir, { recursive: true });
  }

  // Mapping the provided SVGs
  const mapping = [
    { src: 'Untitled design (2).svg', dest: 'quran.svg' },
    { src: 'Untitled design (1).svg', dest: 'tasbeeh.svg' },
    { src: 'Untitled design.svg', dest: 'adhkar.svg' }
  ];

  mapping.forEach(item => {
    const srcFile = path.join(rootSrcDir, item.src);
    const destFile = path.join(rootDestDir, item.dest);
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, destFile);
    }
  });
} catch (e) {
  console.error('Error copying default icons:', e);
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'aalima-api',
        configureServer(server) {
          server.middlewares.use(createAalimaMiddleware());
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
