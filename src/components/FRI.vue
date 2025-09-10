<script lang="ts" setup>
import AddEntry from "./AddEntry.vue";

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
                <input v-model="url_enabled" checked class="form-check-input m-0" role="switch" type="checkbox">
            </div>
        </div>
        <div v-if="url_enabled" class="mt-2 d-flex align-items-center gap-2 pb-1">
            <input v-model="subjects_input" class="form-control" placeholder="Subject IDs (e.g., 123 456 789)"
                   type="text">
            <button class="btn btn-primary" type="button" @click="redirect_tab">Go</button>
        </div>

        <hr class="my-3"/>

        <AddEntry :start_max="21" :start_min="7"/>
    </main>
</template>

<style scoped>
</style>
