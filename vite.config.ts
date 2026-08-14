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
                // vite 8 (rolldown + sass modern API) 不再从项目根目录解析裸路径，
                // 通过 loadPaths 指定根目录，使下方 "src/style/..." 可正常导入
                loadPaths: [path.resolve(import.meta.dirname)],
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
            "@": path.resolve(import.meta.dirname, "./src"),
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
        rolldownOptions: {
            transform: {
                target: 'es2015' // Ensures transpilation to a compatible version
            }
        }
    },
    build: {
        target: 'es5', // Ensure the build output is compatible with ES5
        minify: 'terser', // Ensure minification is compatible with ES5
        rollupOptions: {
            output: {
                // 代码分割优化（rolldown 仅支持函数形式的 manualChunks）
                manualChunks(id) {
                    if (!id.includes('node_modules')) return;
                    if (id.includes('element-plus')) return 'element-plus';
                    if (/[\\/]node_modules[\\/](@vue|vue|vue-router|vuex)[\\/]/.test(id)) return 'vue-vendor';
                }
            }
        }
    }
})
