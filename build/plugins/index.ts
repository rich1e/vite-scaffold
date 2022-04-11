/*
 * @Author: rich1e
 * @Date: 2022-04-11 14:47:51
 * @LastEditors: rich1e
 * @LastEditTime: 2022-04-11 14:56:55
 */
import { ConfigEnv } from 'vite';
import type { Plugin } from 'vite';

// Plugins
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { viteMockServe } from 'vite-plugin-mock';
import visualizer from 'rollup-plugin-visualizer';
import viteSvgIcons from 'vite-plugin-svg-icons';

import path from 'path';

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
      dts: false, // enabled by default if `typescript` is installed
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

  // vite-plugin-svg-icons
  vitePlugins.push(
    viteSvgIcons({
      // 指定需要缓存的图标文件夹
      iconDirs: [
        path.resolve(process.cwd(), 'src/icons/general'),
        path.resolve(process.cwd(), 'src/icons/navbar'),
      ],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    }),
  );

  return vitePlugins;
}
