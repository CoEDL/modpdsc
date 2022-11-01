<template>
    <div class="flex flex-col">
        <div v-if="data.error" class="text-center p-4">There was an error loading that file.</div>
        <div
            class="overflow-scroll"
            :style="{ height: transcriptionPanelHeight }"
            :id="data.transcription.displayName"
            v-if="!data.error"
        >
            <component
                :is="transcriptionRendererComponent"
                :transcription="data.transcription"
                :current-time="props.currentTime"
                v-on:play-from="playFrom"
            ></component>
        </div>
    </div>
</template>

<script setup>
import RenderTranscriptionEafComponent from "./RenderTranscriptionEAF.component.vue";
import RenderTranscriptionIxtComponent from "./RenderTranscriptionIXT.component.vue";
import RenderTranscriptionTrsComponent from "./RenderTranscriptionTRS.component.vue";
import RenderTranscriptionFlextextComponent from "./RenderTranscriptionFlextext.component.vue";
import { reactive, shallowRef, onMounted, onBeforeUnmount, watch, inject, computed } from "vue";
import { useRoute } from "vue-router";
import { isEmpty } from "lodash";
import { scrollTo } from "vue-scrollto";
import { loadTranscription } from "../lib.js";
const $http = inject("$http");
const $route = useRoute();

const $emit = defineEmits(["play-from"]);
const props = defineProps({
    transcriptions: {
        type: Array,
        required: true,
    },
    selectedTranscription: {
        type: Object,
        required: true,
    },
    currentTime: {
        type: Number,
    },
});
const data = reactive({
    watchers: {},
    error: false,
    transcriptionRendererComponent: undefined,
    transcription: {
        type: undefined,
        segments: [],
    },
});
let transcriptionRendererComponent = shallowRef();

data.watchers.selectedTranscription = watch(
    () => props.selectedTranscription,
    () => {
        load();
    }
);

console.log(window.innerWidth);
let transcriptionPanelHeight = computed(() => {
    let subtract = window.innerWidth > 1024 ? 300 : 450;
    return `${window.innerHeight - subtract}px`;
});
onMounted(() => {
    load();
});
onBeforeUnmount(() => {
    data.watchers.selectedTranscription();
});
async function load() {
    if (!props.selectedTranscription?.["@id"]) return;
    try {
        let { transcription } = await loadTranscription({
            $http,
            $route,
            filename: props.selectedTranscription["@id"],
        });
        if (isEmpty(transcription)) {
            data.error = true;
            return;
        }
        data.transcription = {
            ...props.selectedTranscription,
            ...transcription,
            displayName: (props.selectedTranscription.displayName = props.selectedTranscription[
                "@id"
            ]
                .split(".")
                .slice(0, -1)
                .join(".")),
        };
        switch (data.transcription.type) {
            case "ixt":
                transcriptionRendererComponent.value = RenderTranscriptionIxtComponent;
                break;
            case "trs":
                transcriptionRendererComponent.value = RenderTranscriptionTrsComponent;
                break;
            case "eaf":
                transcriptionRendererComponent.value = RenderTranscriptionEafComponent;
                break;
            case "flextext":
                transcriptionRendererComponent.value = RenderTranscriptionFlextextComponent;
                break;
        }
        data.error = false;
        setTimeout(() => {
            scrollTo(`#${data.transcription.displayName}`, 300, {
                container: `#${data.transcription.displayName}`,
            });
        }, 1500);
    } catch (error) {
        data.error = true;
        transcriptionRendererComponent.value = "";
    }
}
function playFrom({ start, end }) {
    $emit("play-from", { start, end });
}
</script>
