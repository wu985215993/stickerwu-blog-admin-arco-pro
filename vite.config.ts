import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from '@arco-plugins/vite-plugin-svgr';
import vitePluginForArco from '@arco-plugins/vite-react';
import setting from './src/settings.json';
import { viteMockServe } from 'vite-plugin-mock';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/res': {
        target: 'http://8.130.39.8:7001',
      },
      '/api': {
        target: 'http://8.130.39.8:7001',
      },
      '/static': {
        target: 'http://8.130.39.8:7001',
      },
    },
  },
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
  plugins: [
    react(),
    svgrPlugin({
      svgrOptions: {},
    }),
    vitePluginForArco({
      theme: '@arco-themes/react-juzi001',
    }),
    /**
     * @link https://blog.csdn.net/q1463944989/article/details/131685799?spm=1001.2101.3001.6650.7&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-7-131685799-blog-97636532.235%5Ev38%5Epc_relevant_sort_base3&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-7-131685799-blog-97636532.235%5Ev38%5Epc_relevant_sort_base3&utm_relevant_index=8
     * @description 解决 mockjs 上传报错问题 */
    viteMockServe({
      localEnabled: false,
      prodEnabled: false,
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});
