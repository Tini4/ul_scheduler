<script lang="ts" setup>
import {defineModel, onMounted} from 'vue';

import '@simonwep/pickr/dist/themes/monolith.min.css';
import Pickr from '@simonwep/pickr';

const model = defineModel();

onMounted(() => {
    const pickr = Pickr.create({
        el: '.pickr-div',
        theme: 'monolith',
        position: 'right-middle',

        default: 'rgba(132, 8, 0, 1)',
        swatches: [
            'rgba(132, 8, 0, 1)',
            'rgba(97, 84, 0, 1)',
            'rgba(23, 111, 99, 1)',
            'rgba(33, 27, 75, 1)',
            'rgba(140, 70, 0, 1)',
            'rgba(35, 75, 10, 1)',
            'rgba(77, 0, 37, 1)'
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
