<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import {storage, tabs} from 'webextension-polyfill';

const save_enabled = ref<boolean>(false);
const schedules = ref<Map<string, string>>(new Map());
const name_input = ref<string>('');

async function get_schedules() {
    const res = await storage.local.get('schedules');

    schedules.value = new Map(Object.entries(res.schedules ?? {}));
}

async function set_schedules() {
    await storage.local.set({schedules: Object.fromEntries(schedules.value.entries())});
}

async function save_schedule(event: Event) {
    const form = event.target as HTMLFormElement;
    form.classList.add('was-validated');

    if (name_input.value === '')
        return;

    const [tab] = await tabs.query({active: true, currentWindow: true});

    if (tab?.id !== undefined) {
        const res = await tabs.sendMessage(tab.id, {
            type: 'save_schedule',
            payload: {},
        });

        const typed_res = res as {
            success: boolean,
            payload: {
                html: string,
            },
        };
        const {html} = typed_res.payload;

        schedules.value.set(name_input.value, html);

        name_input.value = '';
        form.classList.remove('was-validated');

        await set_schedules();
    }
}

async function load_schedule(name: string) {
    const [tab] = await tabs.query({active: true, currentWindow: true});
    if (tab?.url !== undefined && tab?.id !== undefined) {
        const url = new URL(tab.url);

        url.search = '';  // TODO?
        url.searchParams.set('schedule', name);

        await tabs.sendMessage(tab.id, {
            type: 'redirect',
            payload: {
                url: url.toString(),
            },
        });
    }
}

async function remove_schedule(name: string) {
    schedules.value.delete(name);

    await set_schedules();
}

onMounted(get_schedules);
</script>

<template>
    <div class="d-flex align-items-center px-2">
        <div class="d-flex align-items-center justify-content-center">
            <h5 class="m-0">Save schedule</h5>
        </div>
        <div class="form-check form-switch p-0 m-0 d-flex align-items-center justify-content-center ms-auto">
            <input v-model="save_enabled" checked class="form-check-input m-0" role="switch" type="checkbox">
        </div>
    </div>
    <div v-if="save_enabled" class="pb-1">
        <form class="needs-validation" novalidate @submit.prevent="save_schedule">
            <div class="d-flex align-items-center gap-2 mt-2">
                <input v-model="name_input" class="form-control" placeholder="Name" required type="text">
                <button class="btn btn-primary" type="submit">Save</button>
            </div>
        </form>
        <ul class="list-group mt-2">
            <li v-for="name in Array.from(schedules.keys())" :key="name"
                class="list-group-item d-flex justify-content-between align-items-center">
                <small>{{ name }}</small>
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-danger btn-sm" type="button" @click="remove_schedule(name)">Remove</button>
                    <button class="btn btn-primary btn-sm" type="button" @click="load_schedule(name)">Load</button>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
</style>
