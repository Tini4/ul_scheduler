// noinspection JSUnusedGlobalSymbols

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        emptyOutDir: false,
        //outDir: 'dist/content',
        terserOptions: {
            mangle: false,
        },
        rollupOptions: {
            input: {
                fri: 'src/content/fri/index.css',
            },
            output: {
                assetFileNames: 'src/content/[name].css',
                extend: true,
            },
        },
    },
})
