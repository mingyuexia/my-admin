import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
import {visualizer} from 'rollup-plugin-visualizer'

import VueSetupExtend from 'vite-plugin-vue-setup-extend'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd()) // 获取.env文件里定义的环境变量
  return defineConfig({
    base: env.VITE_BASE,
    plugins: [
      vue(),
      VueSetupExtend(),
      visualizer(),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      AutoImport({
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
        imports: ['vue', 'vue-router', '@vueuse/core'],
        //注意这个配置和src同级
        dts: './auto-imports.d.ts'
      })
    ],
    server: {
      host: '0.0.0.0', // 监听所有IP
      port: 8888, // 自定义的端口号
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL, // 后端 API 地址
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '~com': path.resolve(__dirname, 'src/components')
      }
    },
    define: {
      'process.env': env
    },
    esbuild: {
      drop: ['console', 'debugger']
    }
  })
}
