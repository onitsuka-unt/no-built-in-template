// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

import data from './src/data/project';
const { siteUrl, baseUrl, port } = data;

const assetsDir = 'assets';

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  base: baseUrl,
  integrations: [icon()],
  server: {
    port: port,
  },
  outDir: `./dist${baseUrl}`,
  build: {
    assets: `${assetsDir}/js/`,
    inlineStylesheets: 'never', // css外部ファイル化のため
  },
  vite: {
    build: {
      assetsInlineLimit: 0, // 小さなファイルでもインライン化しない
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => (assetInfo.names[0].endsWith('.css') ? `${assetsDir}/css/[name][hash][extname]` : assetInfo.names[0].endsWith('.js') ? `${assetsDir}/js/[name][hash][extname]` : `${assetsDir}/image/[name][hash][extname]`),
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use '@/styles/global.scss' as *;`,
        },
      },
    },
  },
});
