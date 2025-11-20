import {resolve} from 'node:path';
import {cwd} from 'node:process';
import {fileURLToPath, URL} from 'node:url';
import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import Unocss from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import {VueRouterAutoImports} from 'unplugin-vue-router';
import VueRouter from 'unplugin-vue-router/vite';
import {defineConfig, loadEnv} from 'vite';
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons';

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, cwd());
  return {
    server: {
      host: '0.0.0.0',
      proxy: {
        [`${env.VITE_API_BASE_URL}`]: {
          target: '',
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    plugins: [
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
      VueRouter({
        exclude: ['src/pages/**/components/**'],
        dts: 'src/typed-router.d.ts',
      }),
      vue(),
      AutoImport({
        imports: ['vue', VueRouterAutoImports],
        resolvers: [ElementPlusResolver()],
        dts: 'src/auto-imports.d.ts',
      }),
      Components({
        types: [],
        directoryAsNamespace: true,
        collapseSamePrefixes: true,
        dts: 'src/components.d.ts',
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass',
          }),
        ],
      }),
      createSvgIconsPlugin({
        iconDirs: [resolve(cwd(), 'src/assets/svgs')],
        symbolId: 'icon-[dir]-[name]',
      }),
      Unocss(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use '@/styles/utils.scss' as *;`,
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  };
});
