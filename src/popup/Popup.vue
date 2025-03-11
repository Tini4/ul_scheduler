<script lang="ts" setup>
import Header from '../components/Header.vue';
import Unsupported from '../components/Unsupported.vue';
import FRI from '../components/FRI.vue';
import BF from '../components/BF.vue';

import {onMounted, ref} from 'vue';
import {tabs} from 'webextension-polyfill';

const url = ref<string>('');
const urls = {
    FRI: 'urnik.fri.uni-lj.si',
    BF: 'urniki.bf.uni-lj.si',
};

async function get_url() {
    const tab = await tabs.query({active: true, currentWindow: true});

    url.value = tab[0]?.url ?? '';
}

onMounted(get_url);
</script>

<template>
    <Header/>

    <FRI v-if="url.includes(urls.FRI)"/>
    <BF v-else-if="url.includes(urls.BF)"/>
    <Unsupported v-else/>
</template>

<style scoped>
</style>
