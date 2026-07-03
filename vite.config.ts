// noinspection JSUnusedGlobalSymbols

import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import pkg from './package.json';

// https://vite.dev/config/
export default defineConfig(({}) => {
    console.log(`🧱 Building...`);

    return {
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
        define: {
            __APP_VERSION__: JSON.stringify(pkg.version),
        },
    };
});
