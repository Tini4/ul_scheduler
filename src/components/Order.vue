<script lang="ts" setup>
import {tabs} from "webextension-polyfill";

async function order() {
    const [tab] = await tabs.query({active: true, currentWindow: true});
    if (tab?.id !== undefined) {
        await tabs.sendMessage(tab.id, {
            type: 'order',
            payload: {},
        });
    }
}
</script>

<template>
    <p class="mb-0">After you are done removing, press
        <button class="btn btn-secondary py-0 px-1" type="button" @click="order">Ctrl+O</button>
        to order the entries.
    </p>
</template>

<style scoped>
</style>
