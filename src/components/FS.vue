<script lang="ts" setup>
import AddEntry from "./AddEntry.vue";
import SaveLoad from "./SaveLoad.vue";
</script>

<template>
    <main>
        <p class="mb-0">Remove entries by clicking on them.</p>
        <p class="mb-0">To undo a removal, press Ctrl+Z.</p>
        <p class="mb-0">After you are done removing, press Ctrl+O to order the entries.</p>

        <hr class="my-3"/>

        <AddEntry :start_max="20" :start_min="7" :step="0.5"/>

        <hr class="my-3"/>

        <SaveLoad/>

        <hr class="my-3"/>
    </main>
</template>

<style scoped>
</style>
