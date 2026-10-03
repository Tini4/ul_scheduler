<script lang="ts" setup>
import AddEntry from "./AddEntry.vue";
import SaveLoad from "./SaveLoad.vue";
import Order from "./Order.vue";
import Undo from "./Undo.vue";
</script>

<template>
    <main>
        <p class="mb-0">Remove entries by clicking on them.</p>
        <Undo/>
        <Order/>

        <hr class="my-3"/>

        <AddEntry :start_max="20" :start_min="7" :step="0.5"/>

        <hr class="my-3"/>

        <SaveLoad/>

        <hr class="my-3"/>
    </main>
</template>

<style scoped>
</style>
