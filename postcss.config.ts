// noinspection JSUnusedGlobalSymbols

import postcss_mixins from 'postcss-mixins';
import postcss_nested from 'postcss-nested';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

export default {
    plugins: [
        postcss_mixins,
        postcss_nested,
        autoprefixer,
        cssnano,
    ],
};
