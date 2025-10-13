// noinspection JSUnusedGlobalSymbols

import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {execSync} from 'child_process';

const entries = ['fri', 'bf', 'fmf', 'fkkt', 'fs'];

// https://vite.dev/config/
export default defineConfig(({command}) => {
    if (command === 'build' && !process.env.ENTRY) {
        // Run vite recursively for each entry
        for (const e of entries) {
            execSync(
                `node -e "process.env.ENTRY='${e}'; require('vite').build({ configFile: 'vite.config.script.ts' })"`,
                {stdio: 'inherit'}
            );
        }

        process.exit(0);
    }

    const entry = process.env.ENTRY ?? entries[0];

    console.log(`\n🧱 Building ${entry}...`);

    return {
        plugins: [vue()],
        build: {
            emptyOutDir: false,
            terserOptions: {
                mangle: false,
            },
            rollupOptions: {
                input: `src/content/${entry}/index.ts`,
                output: {
                    entryFileNames: `src/content/${entry}.js`,
                    format: 'iife',
                    inlineDynamicImports: true,
                    manualChunks: undefined,
                },
            },
        },
    };
});
