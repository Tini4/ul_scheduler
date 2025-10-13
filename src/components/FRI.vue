<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import {storage, tabs} from 'webextension-polyfill';

import AddEntry from "./AddEntry.vue";
import SaveLoad from "./SaveLoad.vue";

const url_enabled = ref<boolean>(false);
const subjects = ref<Set<string>>(new Set());
const id_input = ref<string>('');

async function get_subjects() {
    {
        // INFO: Backwards compatibility, remove after 25/26
        const res_old = await storage.local.get('subjects_input');
        const subjects_input_old = (res_old.subjects_input as string) ?? '';

        await storage.local.remove('subjects_input');

        if (subjects_input_old !== '') {
            const subjects_old = subjects_input_old
                .trim().split(/\s+/).map(i => parseInt(i, 10)).filter(i => !isNaN(i));

            subjects.value = new Set(subjects_old.map(i => i.toString()));

            await set_subjects();

            return;
        }
    }

    const res = await storage.local.get('subjects');

    subjects.value = new Set(res.subjects as Array<string> ?? []);
}

async function set_subjects() {
    await storage.local.set({subjects: Array.from(subjects.value)});
}

async function add_subject(event: Event) {
    const form = event.target as HTMLFormElement;
    form.classList.add('was-validated');

    if (id_input.value === '')
        return;

    subjects.value.add(id_input.value);

    id_input.value = '';
    form.classList.remove('was-validated');

    await set_subjects();
}

async function remove_subject(id_: string) {
    subjects.value.delete(id_);

    await set_subjects();
}

function get_query(): string {
    return Array.from(subjects.value).map(i => `subject=${i}`).join('&');
}

async function redirect_tab() {
    const [tab] = await tabs.query({active: true, currentWindow: true});
    const query = get_query();

    if (tab?.url !== undefined && tab?.id !== undefined && query) {
        const url = new URL(tab.url);
        if (!url.pathname.includes('allocations')) {
            if (!url.pathname.endsWith('/')) {
                url.pathname += '/';
            }
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
        <div v-if="url_enabled" class="pb-1">
            <form class="needs-validation" novalidate @submit.prevent="add_subject">
                <div class="d-flex align-items-center gap-2 mt-2">
                    <input v-model="id_input" class="form-control" placeholder="Subject ID" required type="text">
                    <button class="btn btn-primary" type="submit">Add</button>
                </div>
            </form>
            <ul class="list-group mt-2">
                <li v-for="subj in Array.from(subjects)" :key="subj"
                    class="list-group-item d-flex justify-content-between align-items-center">
                    <small>{{ subj }}</small>
                    <button class="btn btn-danger btn-sm" type="button" @click="remove_subject(subj)">Remove</button>
                </li>
            </ul>
            <button class="btn btn-primary mt-2 w-100" type="button" @click="redirect_tab">Go</button>
        </div>

        <hr class="my-3"/>

        <AddEntry :start_max="22" :start_min="7"/>

        <hr class="my-3"/>

        <SaveLoad/>
    </main>
</template>

<style scoped>
</style>
