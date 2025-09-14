// noinspection JSUnusedGlobalSymbols

import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        minify: 'terser',
        terserOptions: {
            mangle: false,
        },
        rollupOptions: {
            input: {
                popup: 'src/popup/index.html',
            },
        },
    },
});
