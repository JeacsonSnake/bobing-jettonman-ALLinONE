// vite.config.js
import {
    defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        legacy({
            targets: ['defaults', 'not IE 11'],
            additionalLegacyPolyfills: ['regenerator-runtime/runtime']
        })
    ],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                    @import "src/style/variables.scss";
                    @import "src/style/mobile-mixins.scss";
                `
            }
        }
    },
    base: '/',
    resolve: {
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        cors: {
            origin: '*',
            credentials: true,
        },
        // 添加移动端开发时的 host 配置
        host: '0.0.0.0',
        port: 5173
    },
    optimizeDeps: {
        esbuildOptions: {
            target: 'es2015' // Ensures esbuild transpiles to a compatible version
        }
    },
    build: {
        target: 'es5', // Ensure the build output is compatible with ES5
        minify: 'terser', // Ensure minification is compatible with ES5
        rollupOptions: {
            output: {
                // 代码分割优化
                manualChunks: {
                    'element-plus': ['element-plus'],
                    'vue-vendor': ['vue', 'vue-router', 'vuex']
                }
            }
        }
    }
})
