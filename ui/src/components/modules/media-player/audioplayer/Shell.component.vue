<template>
    <div class="flex flex-col bg-indigo-100 p-1">
        <div class="flex flex-col md:flex-row md:space-x-2">
            <div class="p-2">{{ data.selectedAudioFile }}</div>
            <!-- <copy-to-clipboard-component :data="itemLink" /> -->
            <div class="flex-grow"></div>
            <el-pagination
                v-model:currentPage="data.current"
                :page-size="1"
                layout="total, prev, pager, next"
                :total="data.total"
                @current-change="update"
            />
        </div>
        <render-audio-element-component
            class="p-2"
            v-if="data.ready"
            :name="data.selectedAudioFile"
            :audioFiles="data.audioFiles[data.selectedAudioFile]"
            :transcriptions="data.transcriptions[data.selectedAudioFile]"
        />
    </div>
</template>

<script setup>
import { getFilesByEncoding, getPresignedUrl, getFilesByName } from "../lib";
import { cloneDeep, compact, orderBy, groupBy } from "lodash";
import RenderAudioElementComponent from "./RenderAudioElement.component.vue";
import CopyToClipboardComponent from "@/components/modules/CopyToClipboard.component.vue";
import { reactive, onMounted, nextTick, inject, computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import Zoomist from "zoomist";
const $http = inject("$http");
const $store = useStore();
const $route = useRoute();
const $emit = defineEmits(["update-route"]);

const props = defineProps({
    crate: {
        type: Object,
        required: true,
    },
});
const data = reactive({
    audio: {},
    transcriptions: {},
    current: 1,
    total: 0,
    selectedAudioFile: undefined,
    itemLink: undefined,
    ready: false,
});
onMounted(() => {
    init();
});
async function init() {
    let audioFiles = getFilesByEncoding({
        crate: props.crate,
        formats: $store.getters.getConfiguration.ui.audioFormats,
    });

    audioFiles = orderBy(audioFiles, "name");
    data.audioFiles = groupBy(audioFiles, (a) => a["@id"].split(".").shift());

    // if ($route.query.transcription) {
    //     const transcription = $route.query.transcription.split(".").shift();
    //     audioFiles = audioFiles.filter((v) => v.name.split(".").shift() === transcription);
    // }

    let transcriptions = getFilesByName({
        crate: props.crate,
        formats: $store.getters.getConfiguration.ui.transcriptionFileExtensions,
    });
    // if ($route.query.transcription) {
    //     const transcription = $route.query.transcription;
    //     transcriptions = transcriptions.filter((t) => t["@id"] === transcription);
    // }
    data.transcriptions = groupBy(transcriptions, (t) => t["@id"].split(".").shift());

    // console.log(JSON.stringify(transcriptions, null, 2));
    // console.log(JSON.stringify(audioFiles, null, 2));
    data.total = Object.keys(data.audioFiles).length;
    await setSelectedFile();
    // for (let name of Object.keys(audioFiles)) {
    //     data.audio[name] = [];
    //     data.transcriptions[name] = [];
    //     for (let audioFile of audioFiles[name]) {
    //         let url = await getPresignedUrl({
    //             $http: this.$http,
    //             identifier: this.$route.params.identifier,
    //             filename: audioFile["@id"],
    //         });
    //         this.audio[name].push({
    //             ...audioFile,
    //             url,
    //         });
    //     }
    //     for (let transcription of transcriptions[name]) {
    //         let url = await getPresignedUrl({
    //             $http: this.$http,
    //             identifier: this.$route.params.identifier,
    //             filename: transcription["@id"],
    //         });
    //         this.transcriptions[name].push({
    //             ...transcription,
    //             url,
    //         });
    //     }
    // }

    // this.total = Object.keys(this.audio).length;
    // if (this.$route.hash && this.$route.query?.type === "audio") {
    //     this.current = Object.keys(this.audio).indexOf(this.$route.hash.replace("#", "")) + 1;
    // }
    // this.setSelectedFile();
}

async function load() {
    const file = data.audioFiles[data.selectedAudioFile][0];
    if (!file.url) {
        let url = await getPresignedUrl({
            $http,
            $route,
            filename: file["@id"],
        });
        file.url = url;
    }
}
async function update(number) {
    data.current = number;
    await setSelectedFile();
}
async function setSelectedFile() {
    data.ready = false;
    data.selectedAudioFile = Object.keys(data.audioFiles)[data.current - 1];
    $emit("update-route", {
        contentType: "audio",
        contentId: data.selectedAudioFile,
    });
    await load();
    data.ready = true;
    // this.$nextTick(() => {
    //     this.itemLink = window.location;
    // });
}
</script>
