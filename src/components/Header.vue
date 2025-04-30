<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue';
import {storage, tabs} from 'webextension-polyfill';

const enabled = ref<boolean>(true);
const refresh_visible = ref<boolean>(true);

async function get_enabled() {
    const res = await storage.local.get('enabled');

    enabled.value = (res.enabled as boolean) ?? true;
}

async function set_enabled() {
    await storage.local.set({enabled: enabled.value});

    refresh_visible.value = true;
}

async function reload() {
    refresh_visible.value = false;

    await tabs.reload();
}

onMounted(get_enabled);
watch(enabled, set_enabled);
</script>

<template>
    <header class="d-flex align-items-center gap-3 px-2">
        <div class="d-flex align-items-center justify-content-center">
            <h2 class="m-0">UL scheduler</h2>
        </div>
        <div class="d-flex align-items-center justify-content-center ms-auto">
            <i :style="{'visibility': refresh_visible ? 'visible' : 'hidden'}" class="bi bi-arrow-clockwise fs-4"
               @click="reload"/>
        </div>
        <div class="form-check form-switch p-0 m-0 d-flex align-items-center justify-content-center">
            <input v-model="enabled" checked class="form-check-input m-0" role="switch" type="checkbox">
        </div>
    </header>
</template>

<style scoped>
</style>
