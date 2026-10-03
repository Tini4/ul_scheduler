<script lang="ts" setup>
import {tabs} from "webextension-polyfill";

async function undo() {
    const [tab] = await tabs.query({active: true, currentWindow: true});
    if (tab?.id !== undefined) {
        await tabs.sendMessage(tab.id, {
            type: 'undo',
            payload: {},
        });
    }
}
</script>

<template>
    <p class="mb-0">To undo a removal, press
        <button class="btn btn-secondary py-0 px-1" type="button" @click="undo">Ctrl+Z</button>.
    </p>
</template>

<style scoped>
</style>
