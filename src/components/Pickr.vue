<script lang="ts" setup>
import {defineModel, onMounted} from 'vue';

import '@simonwep/pickr/dist/themes/monolith.min.css';
import Pickr from '@simonwep/pickr';

const model = defineModel<string>();

onMounted(() => {
    const pickr = Pickr.create({
        el: '.pickr-div',
        theme: 'monolith',
        position: 'right-middle',

        default: model.value,
        swatches: [
            'rgba(236, 138, 127, 1)',
            'rgba(237, 178, 113, 1)',
            'rgba(246, 246, 186, 1)',
            'rgba(175, 209, 116, 1)',
            'rgba(147, 203, 194, 1)',
            'rgba(136, 175, 202, 1)',
            'rgba(192, 188, 214, 1)',
        ],

        defaultRepresentation: 'HEXA',
        components: {
            preview: true,
            opacity: false,
            hue: true,

            interaction: {
                input: true,
                save: true
            }
        }
    });

    pickr.on('save', (color: Pickr.HSVaColor, instance: Pickr) => {
        instance.hide();
        model.value = color.toHEXA().toString();
    });
});
</script>

<template>
    <div class="form-control form-control-color">
        <div class="pickr-div"></div>
    </div>
</template>

<!--suppress CssUnusedSymbol -->
<style>
.pickr, .pcr-button {
    position: static !important;
    width: 100% !important;
    height: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
}

.pcr-app {
    background-color: #333940 !important;
}
</style>
