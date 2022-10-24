<template>
    <div class="px-2">
        <el-tabs type="border-card" tab-position="top" v-model="data.activeTab">
            <el-tab-pane label="Metadata" name="metadata">
                <describo-crate-builder
                    v-if="!data.error"
                    v-loading="data.loading && !data.error"
                    :crate="data.crate"
                    :profile="data.profile"
                    :readonly="true"
                    @ready="ready"
                />
                <div v-if="data.error" class="bg-red-200 text-center p-2 font-light">
                    The metadata for that item is not able to be loaded.
                </div>
            </el-tab-pane>
            <el-tab-pane
                label="Content"
                name="content"
                v-if="!data.loading && data.type === 'item'"
            >
                <render-content-component :crate="data.crate" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import RenderContentComponent from "./RenderContent.component.vue";
import { useRoute } from "vue-router";
import { inject, onMounted, reactive } from "vue";
import { useStore } from "vuex";
const $store = useStore();
const $route = useRoute();
const $http = inject("$http");
const $http = inject("$http");

let data = reactive({
    activeTab: "content",
    loading: false,
    error: false,
    type: undefined,
    crate: {},
    profile: {
        layouts: {
            Dataset: [
                {
                    name: "About",
                    description: "Key information about this item",
                    inputs: ["identifier", "description", "contentLanguage", "subjectLanguage"],
                },
                {
                    name: "Files",
                    description: "Files forming part of this item",
                    inputs: ["hasPart"],
                },
            ],
        },
    },
    // profile: {},
});

onMounted(() => {
    init();
});
async function init() {
    let response;

    data.loading = true;
    data.error = false;
    const { collectionId, itemId } = $route.params;
    if (collectionId && !itemId) {
        response = await $http.get({ route: `/collections/${collectionId}/metadata` });
        data.type = "collection";
    } else if (collectionId && itemId) {
        response = await $http.get({
            route: `/collections/${collectionId}/items/${itemId}/metadata`,
        });
        data.type = "item";
    } else if (itemId && !collectionId) {
        response = await $http.get({ route: `/items/${itemId}/metadata` });
        data.type = "item";
    }
    if (response.status === 200) {
        let { crate } = await response.json();
        data.crate = { ...crate };
        data.loading = false;
    } else {
        data.loading = false;
        data.error = true;
    }
}

function ready() {
    data.loading = false;
}
</script>
