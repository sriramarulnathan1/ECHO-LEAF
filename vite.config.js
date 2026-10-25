import { defineConfig } from 'vite';

const forbitProxy = {
  target: 'http://localhost:8080',
  changeOrigin: true,
};

export default defineConfig({
  server: {
    proxy: {
      '/forbit': {
        ...forbitProxy,
        rewrite: (path) => path.replace(/^\/forbit/, '') || '/',
      },
      '/api': forbitProxy,
      '/satellite_imagery': forbitProxy,
      '/style.css': forbitProxy,
      '/app.js': forbitProxy,
      '/forest_data.js': forbitProxy,
    },
  },
});
