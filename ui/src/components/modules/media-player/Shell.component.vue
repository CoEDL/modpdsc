<template>
    <div>
        <el-tabs tab-position="left" v-model="data.activeTab">
            <el-tab-pane label="Images" name="image" v-if="data.enable.image">
                <template #label>
                    <div class="text-lg py-2"><i class="fas fa-images"></i> Images</div>
                </template>
                <image-viewer-component
                    class="my-1"
                    v-if="data.activeTab === 'image'"
                    :crate="this.crate"
                    @update-route="updateRoute"
                />
            </el-tab-pane>
            <el-tab-pane label="Audio" name="audio" v-if="data.enable.audio">
                <template #label>
                    <div class="text-lg py-2"><i class="fas fa-volume-up"></i> Audio</div>
                </template>
                <audio-player-component
                    class="my-1"
                    v-if="data.activeTab === 'audio'"
                    :crate="props.crate"
                    @update-route="updateRoute"
                />
            </el-tab-pane>
            <el-tab-pane label="Video" name="video" v-if="data.enable.video">
                <template #label>
                    <div class="text-lg py-2"><i class="fas fa-video"></i> Videos</div>
                </template>
                <video-player-component
                    v-if="data.activeTab === 'video'"
                    :crate="props.crate"
                    @update-route="updateRoute"
                />
            </el-tab-pane>
            <el-tab-pane label="Documents" name="document" v-if="data.enable.document">
                <template #label>
                    <div class="text-lg py-2"><i class="fas fa-file"></i> Documents</div>
                </template>
                <document-viewer-component
                    class="my-1"
                    v-if="data.activeTab === 'document'"
                    :crate="props.crate"
                    @update-route="updateRoute"
                />
            </el-tab-pane>
            <el-tab-pane label="XML Files" name="xml" v-if="data.enable.xml">
                <template #label>
                    <div class="text-lg py-2"><i class="fas fa-code"></i> XML Files</div>
                </template>
                <xml-viewer-component
                    class="my-1"
                    v-if="data.activeTab === 'xml'"
                    :crate="props.crate"
                    @update-route="updateRoute"
                />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import ImageViewerComponent from "./imageviewer/Shell.component.vue";
import AudioPlayerComponent from "./audioplayer/Shell.component.vue";
import VideoPlayerComponent from "./videoplayer/Shell.component.vue";
import DocumentViewerComponent from "./documentviewer/Shell.component.vue";
import XmlViewerComponent from "./xmlviewer/Shell.component.vue";
import { getFilesByName, getFilesByEncoding } from "./lib";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
const $store = useStore();
const $router = useRouter();
const $route = useRoute();

const props = defineProps({
    crate: {
        type: Object,
        required: true,
    },
});
const data = reactive({
    activeTab: "images",
    enable: {
        image: false,
        audio: false,
        video: false,
        document: false,
        xml: false,
    },
});
onMounted(() => {
    init();
});
function init() {
    data.enable.image =
        getFilesByEncoding({
            crate: props.crate,
            formats: $store.getters.getConfiguration.ui.imageFormats,
        }).length > 0;
    data.enable.audio =
        getFilesByEncoding({
            crate: props.crate,
            formats: $store.getters.getConfiguration.ui.audioFormats,
        }).length > 0;
    data.enable.video =
        getFilesByEncoding({
            crate: props.crate,
            formats: $store.getters.getConfiguration.ui.videoFormats,
        }).length > 0;
    data.enable.document =
        getFilesByName({
            crate: props.crate,
            formats: $store.getters.getConfiguration.ui.documentFileExtensions,
        }).length > 0;
    data.enable.xml =
        getFilesByEncoding({
            crate: props.crate,
            formats: ["application/xml"],
        }).length > 0;
    setActiveTab();
}
function setActiveTab() {
    for (let key of Object.keys(data.enable)) {
        if (data.enable[key]) {
            data.activeTab = key;
            break;
        }
    }
    // if (this.$route.hash && this.$route.query?.type) {
    //     this.activeTab = this.$route.query.type;
    // }
    data.activeTab = "document";
}
function updateRoute(params) {
    const { collectionId, itemId } = $route.params;
    let basePath;
    if (collectionId && !itemId) {
        basePath = `/collections/${collectionId}`;
    } else if (collectionId && itemId) {
        basePath = `/collections/${collectionId}/items/${itemId}`;
    } else if (itemId && !collectionId) {
        basePath = `/items/${itemId}`;
    }

    let { contentType, contentId, query } = params;
    let path;
    if (contentId) {
        path = `${basePath}/${contentType}/${contentId}`;
    } else {
        path = `${basePath}/${contentType}`;
    }
    $router.push({ path, query });
}
</script>
