<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue';
import {storage, tabs} from "webextension-polyfill";

const enabled = ref<boolean>(true);
const refresh_visible = ref<boolean>(true);

async function get_enabled() {
    const res = await storage.local.get('enabled');

    enabled.value = (res.enabled as boolean) ?? true;
}

async function set_enabled(value: boolean) {
    await storage.local.set({enabled: value});

    refresh_visible.value = true;
}

onMounted(get_enabled);
watch(enabled, set_enabled);

async function reload() {
    refresh_visible.value = false;

    const [current_tab] = await tabs.query({ active: true, currentWindow: true });

    if (current_tab) {
        await tabs.reload(current_tab.id);
    }
}
</script>

<template>
    <div class="d-flex align-items-center gap-3">
        <h1>UL scheduler</h1>
        <div class="ms-auto">
            <i class="bi bi-arrow-clockwise" :style="{'visibility': refresh_visible ? 'visible' : 'hidden'}" @click="reload"></i>
        </div>
        <div class="form-check form-switch">
            <input v-model="enabled" checked class="form-check-input" role="switch" type="checkbox">
        </div>
    </div>
</template>

<style scoped>
</style>
