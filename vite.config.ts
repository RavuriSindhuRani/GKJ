import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { app, initApp } from './server/server.js';

function expressPlugin(): Plugin {
  return {
    name: 'express-plugin',
    async configureServer(server) {
      await initApp();
      server.middlewares.use(app);
    },
  };
}

export default defineConfig({
  plugins: [react(), expressPlugin()],
  server: {
    port: 5175,
    host: true,
  },
});
