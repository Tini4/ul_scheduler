<script lang="ts" setup>
import {ref} from "vue";
import {tabs} from 'webextension-polyfill';

const add_enabled = ref<boolean>(false);
const color_input = ref<string>('#ff7fff');
const day_input = ref<string>('');
const start_input = ref<number | null>(null);
const length_input = ref<number | null>(null);
const title_input = ref<string>('');

async function add_entry() {
    if (day_input.value === '' || start_input.value === null || length_input.value === null || title_input.value === '') return;

    const [tab] = await tabs.query({active: true, currentWindow: true});

    if (tab?.id !== undefined) await tabs.sendMessage(tab.id, {
        type: 'add_entry',
        payload: {
            color: color_input.value,
            day: parseInt(day_input.value, 10),
            start: start_input.value,
            length: length_input.value,
            title: title_input.value,
        },
    });
}
</script>

<template>
    <hr class="my-3"/>

    <main class="px-1">
        <p class="mb-2">Remove entries by clicking on them.</p>
        <p class="mb-2">To undo a removal, press Ctrl+Z.</p>
        <p class="mb-0">After you are done removing, press Ctrl+O to order the entries.</p>

        <hr class="my-3"/>

        <div class="d-flex align-items-center px-2">
            <div class="d-flex align-items-center justify-content-center">
                <h5 class="m-0">Add entry</h5>
            </div>
            <div class="form-check form-switch p-0 m-0 d-flex align-items-center justify-content-center ms-auto">
                <input v-model="add_enabled" type="checkbox" class="form-check-input m-0" role="switch" checked>
            </div>
        </div>
        <div v-if="add_enabled">
            <form>
                <div class="d-flex align-items-center gap-2 mt-2">
                    <input v-model="color_input" type="color" class="form-control form-control-color" value="#563d7c" required>
                    <select v-model="day_input" class="form-select w-auto" required>
                        <option value="" disabled>Day</option>
                        <option value="0">Mon</option>
                        <option value="1">Tue</option>
                        <option value="2">Wed</option>
                        <option value="3">Thu</option>
                        <option value="4">Fri</option>
                    </select>
                    <input v-model="title_input" type="text" class="form-control" placeholder="Title" required>
                </div>
                <div class="d-flex align-items-center gap-2 mt-2">
                    <input v-model="start_input" type="number" class="form-control" min="7" max="20" step="0.5" placeholder="Start" required>
                    <input v-model="length_input" type="number" class="form-control" min="1" max="14" step="0.5" placeholder="Length" required>
                    <button type="submit" class="btn btn-primary" @click="add_entry">Add</button>
                </div>
            </form>
        </div>
    </main>
</template>

<style scoped>
</style>
