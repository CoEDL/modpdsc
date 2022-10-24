<template>
    <div>
        <el-tabs type="border-card" tab-position="top" v-model="data.activeTab">
            <el-tab-pane label="Images" name="image" v-if="data.enable.image">
                <span slot="label"> <i class="fas fa-images"></i> Images </span>
                <!-- <image-viewer-component
                    :crate="this.crate"
                    v-if="activeTab === 'image'"
                    @update-route="updateRoute"
                /> -->
            </el-tab-pane>
            <!-- <el-tab-pane label="Audio" name="audio" v-if="enable.audio">
                <span slot="label"> <i class="fas fa-volume-up"></i> Audio </span>
                <audio-player-component
                    :crate="this.crate"
                    v-if="activeTab === 'audio'"
                    @update-route="updateRoute"
                />
            </el-tab-pane> -->
            <!-- <el-tab-pane label="Video" name="video" v-if="enable.video">
                <span slot="label"> <i class="fas fa-video"></i> Video </span>
                <video-player-component
                    :data="data"
                    v-if="activeTab === 'video'"
                    @update-route="updateRoute"
                />
            </el-tab-pane> -->
            <!-- <el-tab-pane label="Documents" name="document" v-if="enable.document">
                <span slot="label"> <i class="fas fa-file-pdf"></i> Documents </span>
                <document-viewer-component
                    :data="data"
                    v-if="activeTab === 'document'"
                    @update-route="updateRoute"
                />
            </el-tab-pane> -->
            <!-- <el-tab-pane label="XML Files" name="xml" v-if="enable.xml">
                <span slot="label"> <i class="fas fa-file"></i> XML Files </span>
                <xml-viewer-component
                    :data="data"
                    v-if="activeTab === 'xml'"
                    @update-route="updateRoute"
                />
            </el-tab-pane> -->
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
import { getFilesByName, getFilesByEncoding, updateRouterLocation } from "./lib";
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
    // data.enable.audio =
    //     getFilesByEncoding({
    //         crate: this.crate,
    //         formats: this.$store.state.configuration.ui.audioFormats,
    //     }).length > 0;

    // this.enable.video =
    //     getFilesByEncoding({
    //         crate: this.crate,
    //         formats: this.$store.state.configuration.ui.videoFormats,
    //     }).length > 0;
    // this.enable.document =
    //     getFilesByName({
    //         crate: this.crate,
    //         formats: this.$store.state.configuration.ui.documentFileExtensions,
    //     }).length > 0;
    // this.enable.xml =
    //     getFilesByEncoding({
    //         crate: this.crate,
    //         formats: ["application/xml"],
    //     }).length > 0;
    setActiveTab();
}
function setActiveTab() {
    // for (let key of Object.keys(this.enable)) {
    //     if (this.enable[key]) {
    //         this.activeTab = key;
    //         break;
    //     }
    // }
    // if (this.$route.hash && this.$route.query?.type) {
    //     this.activeTab = this.$route.query.type;
    // }
    data.activeTab = "image";
}
function updateRoute(params) {
    data.itemLink = updateRouterLocation({
        router: $router,
        route: $route,
        hash: params.hash,
        type: params.type,
    });
}
</script>
