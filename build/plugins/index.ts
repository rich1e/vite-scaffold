import { ConfigEnv } from 'vite';
import type { Plugin } from 'vite';

// Plugins
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { viteMockServe } from 'vite-plugin-mock';
import visualizer from 'rollup-plugin-visualizer';

export function createVitePlugins({ command, mode }: ConfigEnv) {
  const localEnabled = () => {
    if (mode === 'testing') {
      return false;
    } else {
      return command === 'serve';
    }
  };

  const vitePlugins: (Plugin | Plugin[])[] = [
    // Vue
    vue(),
    // JSX
    vueJsx(),
    // Mock
    viteMockServe({
      // default
      mockPath: 'mock',
      localEnabled: localEnabled(),
    }),
  ];

  /**
   * @see https://github.com/antfu/unplugin-vue-components
   * @see https://juejin.cn/post/7012446423367024676
   * @see https://juejin.cn/post/6976558626425028645
   */
  vitePlugins.push(
    Components({
      resolvers: [ElementPlusResolver()],
      // dts: true, // enabled by default if `typescript` is installed
    }),
  );

  // rollup-plugin-visualizer
  vitePlugins.push(
    process.env.REPORT === 'true'
      ? (visualizer({
          filename: './node_modules/.cache/visualizer/stats.html',
          open: true,
          gzipSize: true,
          brotliSize: true,
        }) as Plugin)
      : [],
  );

  return vitePlugins;
}
