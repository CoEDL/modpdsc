<template>
    <div class="flex flex-col lg:flex-row">
        <div class="w-full flex flex-col" :class="{ 'lg:w-2/5': hasTranscriptions }">
            <audio
                ref="mediaElement"
                controls
                class="block w-full"
                @timeupdate="notifyTranscription"
            >
                <source :src="file.url" v-for="file of props.audioFiles" :key="file.url" />
                Your browser does not support the <code>audio</code> element.
            </audio>
            <render-transcription-selector-component
                v-if="hasTranscriptions"
                :transcriptions="props.transcriptions"
                v-on:load-transcription="loadTranscription"
            />
        </div>
        <div
            class="w-full border-l border-gray-300"
            :class="{ 'lg:w-3/5': hasTranscriptions }"
            v-if="hasTranscriptions"
        >
            <render-transcriptions-component
                class="font-light"
                :transcriptions="props.transcriptions"
                :current-time="data.currentTime"
                :selected-transcription="data.selectedTranscription"
                v-on:play-from="playFrom"
            />
        </div>
    </div>
</template>

<script setup>
// import { mixin } from "../RenderMediaMixins";

import RenderTranscriptionsComponent from "../transcription-viewers/RenderTranscriptions.component.vue";
import RenderTranscriptionSelectorComponent from "../transcription-viewers/RenderTranscriptionSelector.component.vue";
import { reactive, onMounted, computed, ref } from "vue";
import { useRoute } from "vue-router";
const $route = useRoute();

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    audioFiles: {
        type: Array,
        required: true,
    },
    transcriptions: {
        type: Array,
        required: true,
    },
});
const data = reactive({
    currentTime: 0,
    selectedTranscription: {},
});
const hasTranscriptions = computed(() => props?.transcriptions.length);
const mediaElement = ref(null);
onMounted(() => {
    data.selectedTranscription = props?.transcriptions?.length
        ? props.transcriptions[0]
        : undefined;
    if ($route.query.transcription) {
        setTimeout(() => {
            playFrom({
                start: $route.query.begin,
                end: $route.query.end,
            });
        }, 3000);
    }
});
function playFrom({ start, end }) {
    mediaElement.value.currentTime = start;
    mediaElement.value.play();
    setTimeout(() => {
        mediaElement.value.pause();
    }, (end - start) * 1000);
}
function notifyTranscription(time) {
    if (mediaElement.value) data.currentTime = mediaElement.value.currentTime;
}
async function loadTranscription(transcription) {
    data.selectedTranscription = transcription;
}
</script>
