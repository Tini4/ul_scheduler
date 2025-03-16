// noinspection JSUnusedGlobalSymbols

import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        emptyOutDir: false,
        terserOptions: {
            mangle: false,
        },
        rollupOptions: {
            input: {
                fri: 'src/content/fri/index.ts',
                bf: 'src/content/bf/index.ts',
                fmf: 'src/content/fmf/index.ts',
                fkkt: 'src/content/fkkt/index.ts',
            },
            output: {
                entryFileNames: 'src/content/[name].js',
                extend: true,
            },
        },
    },
})
