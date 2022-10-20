<template>
    <div class="flex flex-col">
        <div><el-button @click="init">init</el-button></div>
    </div>
</template>

<script setup>
import ItemViewerComponent from "@/components/domain/paradisec.org.au/renderers/ItemViewer.component.vue";
import { useRoute } from "vue-router";
import { inject, onMounted, reactive } from "vue";
import { useStore } from "vuex";
const $store = useStore();
const $route = useRoute();
const $http = inject("$http");

let data = reactive({
    ready: false,
    metadata: {},
    crate: {},
});

onMounted(() => {
    init();
});
async function init() {
    const { collectionId, itemId } = $route.params;
    if (collectionId && !itemId) {
        let response = await $http.get({ route: `/collections/${collectionId}/metadata` });
        if (response.status === 200) {
            let { crate } = await response.json();
            data.crate = { ...crate };
        }
    } else if (collectionId && itemId) {
        let response = await $http.get({
            route: `/collections/${collectionId}/items/${itemId}/metadata`,
        });
        if (response.status === 200) {
            let { crate } = await response.json();
            data.crate = { ...crate };
        }
    } else if (itemId && !collectionId) {
        let response = await $http.get({ route: `/items/${itemId}/metadata` });
        if (response.status === 200) {
            let { crate } = await response.json();
            data.crate = { ...crate };
        }
    }
}
</script>
