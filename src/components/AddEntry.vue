<script lang="ts" setup>
import Pickr from "./Pickr.vue";

import {defineProps, ref} from 'vue';
import {tabs} from 'webextension-polyfill';

const {step = 1, start_min, start_max} = defineProps<{
    step?: number
    start_min: number
    start_max: number
}>();

const add_enabled = ref<boolean>(false);

const color_input = ref<string>('#ec8a7f');
const day_input = ref<string>('');
const start_input = ref<number | null>(null);
const length_input = ref<number | null>(null);
const title_input = ref<string>('');
const teacher_input = ref<string>('');
const classroom_input = ref<string>('');
const type_input = ref<string>('');

async function add_entry() {
    if (day_input.value === '' || start_input.value === null || length_input.value === null || title_input.value === '') return;

    const [tab] = await tabs.query({active: true, currentWindow: true});

    if (tab?.id !== undefined) await tabs.sendMessage(tab.id, {
        type: 'add_entry',
        payload: {
            color: color_input.value,
            day_ix: parseInt(day_input.value, 10),
            start: start_input.value,
            length: length_input.value,
            title: title_input.value,
            teacher: teacher_input.value,
            classroom: classroom_input.value,
            type_: type_input.value,
        },
    });
}
</script>

<template>
    <div class="d-flex align-items-center px-2">
        <div class="d-flex align-items-center justify-content-center">
            <h5 class="m-0">Add entry</h5>
        </div>
        <div class="form-check form-switch p-0 m-0 d-flex align-items-center justify-content-center ms-auto">
            <input v-model="add_enabled" checked class="form-check-input m-0" role="switch" type="checkbox">
        </div>
    </div>
    <div v-if="add_enabled" class="pb-1">
        <form>
            <div class="d-flex align-items-center gap-2 mt-2">
                <Pickr v-model="color_input"/>
                <select v-model="day_input" class="form-select w-auto" required>
                    <option disabled value="">Day</option>
                    <option value="0">Mon</option>
                    <option value="1">Tue</option>
                    <option value="2">Wed</option>
                    <option value="3">Thu</option>
                    <option value="4">Fri</option>
                </select>
                <input v-model="title_input" class="form-control" placeholder="Title" required type="text">
            </div>
            <div class="d-flex align-items-center gap-2 mt-2">
                <input v-model="start_input" :max="start_max" :min="start_min" :step="step" class="form-control"
                       placeholder="Start" required type="number">
                <input v-model="length_input" :min="step" :step="step" class="form-control" placeholder="Length"
                       required type="number">
                <button class="btn btn-primary" type="submit" @click="add_entry">Add</button>
            </div>

            <h6 class="fst-italic m-1">Optional</h6>
            <div class="d-flex align-items-center gap-2 mt-2">
                <input v-model="teacher_input" class="form-control" placeholder="Teacher" type="text">
                <input v-model="classroom_input" class="form-control w-75" placeholder="Classroom" type="text">
                <input v-model="type_input" class="form-control w-50" placeholder="Type" type="text">
            </div>
        </form>
    </div>
</template>

<style scoped>
</style>
