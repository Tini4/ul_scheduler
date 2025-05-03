<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue';
import {storage, tabs} from 'webextension-polyfill';

const url_enabled = ref<boolean>(false);
const subjects_input = ref<string>('');

async function get_subjects() {
    const res = await storage.local.get('subjects_input');

    subjects_input.value = (res.subjects_input as string) ?? '';
}

async function set_subjects() {
    await storage.local.set({subjects_input: subjects_input.value});
}

function get_query(): string {
    const subjects: number[] = subjects_input.value.trim().split(/\s+/).map(i => parseInt(i, 10));

    if (subjects.length === 0) return '';

    return subjects.map(subj => `subject=${subj}`).join('&');
}

async function redirect_tab() {
    const [tab] = await tabs.query({active: true, currentWindow: true});
    const query = get_query();

    if (tab?.url !== undefined && tab?.id !== undefined && query) {
        const url = new URL(tab.url);
        if (!url.pathname.includes('allocations')) {
            if (!url.pathname.endsWith('/')) url.pathname += '/';
            url.pathname += 'allocations';
        }
        url.search = query;

        await tabs.sendMessage(tab.id, {
            type: 'redirect',
            payload: {
                url: url.toString(),
            },
        });
    }
}

onMounted(get_subjects);
watch(subjects_input, set_subjects);

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
            day: day_input.value,
            start: start_input.value,
            length: length_input.value,
            title: title_input.value,
        },
    });
}
</script>

<template>
    <main class="px-1">
        <p class="mb-2">Remove entries by clicking on them.</p>
        <p class="mb-0">To undo a removal, press Ctrl+Z.</p>

        <hr class="my-3"/>

        <div class="d-flex align-items-center px-2">
            <div class="d-flex align-items-center justify-content-center">
                <h5 class="m-0">Generate link</h5>
            </div>
            <div class="form-check form-switch p-0 m-0 d-flex align-items-center justify-content-center ms-auto">
                <input v-model="url_enabled" type="checkbox" class="form-check-input m-0" role="switch" checked>
            </div>
        </div>
        <div v-if="url_enabled" class="mt-2">
            <div class="input-group">
                <input v-model="subjects_input" type="text" class="form-control" placeholder="Enter subject IDs">
                <button class="btn btn-outline-secondary" type="button" @click="redirect_tab">Go</button>
            </div>
        </div>

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
                        <option value="MON">Mon</option>
                        <option value="TUE">Tue</option>
                        <option value="WED">Wed</option>
                        <option value="THU">Thu</option>
                        <option value="FRI">Fri</option>
                    </select>
                    <input v-model="title_input" type="text" class="form-control" placeholder="Title" required>
                </div>
                <div class="d-flex align-items-center gap-2 mt-2">
                    <input v-model="start_input" type="number" class="form-control" min="7" max="21" step="1" placeholder="Start" required>
                    <input v-model="length_input" type="number" class="form-control" min="1" max="15" step="1" placeholder="Length" required>
                    <button type="submit" class="btn btn-primary" @click="add_entry">Add</button>
                </div>
            </form>
        </div>
    </main>
</template>

<style scoped>
</style>
