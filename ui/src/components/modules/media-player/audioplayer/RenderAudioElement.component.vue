<template>
    <div class="flex flex-col lg:flex-row">
        <div
            class="w-full flex flex-col p-4"
            :class="{ 'lg:w-2/5': transcriptions && transcriptions.length }"
        >
            <audio
                ref="mediaElement"
                controls
                class="block w-full"
                @timeupdate="notifyTranscription"
            >
                <source :src="item.url" v-for="item of items" :key="item.url" />
                Your browser does not support the <code>audio</code> element.
            </audio>
            <!-- <render-transcription-selector-component
                v-if="transcriptions && transcriptions.length"
                :transcriptions="transcriptions"
                v-on:load-transcription="loadTranscription"
            /> -->
        </div>
        <!-- <div
            class="w-full border-l border-gray-300"
            :class="{ 'lg:w-3/5': transcriptions && transcriptions.length }"
            v-if="transcriptions && transcriptions.length"
        >
            <render-transcriptions-component
                :transcriptions="transcriptions"
                :current-time="currentTime"
                :selected-transcription="selectedTranscription"
                v-on:play-from="playFrom"
            />
        </div> -->
    </div>
</template>

<script>
// import { mixin } from "../RenderMediaMixins";

import RenderTranscriptionsComponent from "../transcription-viewers/RenderTranscriptions.component.vue";
import RenderTranscriptionSelectorComponent from "../transcription-viewers/RenderTranscriptionSelector.component.vue";

export default {
    components: {
        RenderTranscriptionsComponent,
        RenderTranscriptionSelectorComponent,
    },
    props: {
        name: {
            type: String,
            required: true,
        },
        items: {
            type: Array,
            required: true,
        },
        transcriptions: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            currentTime: 0,
            selectedTranscription: undefined,
        };
    },
    mounted() {
        this.selectedTranscription =
            this.transcriptions && this.transcriptions.length ? this.transcriptions[0] : undefined;
        if (this.$route.query.transcription) {
            setTimeout(() => {
                this.playFrom({
                    start: this.$route.query.begin,
                    end: this.$route.query.end,
                });
            }, 3000);
        }
    },
    methods: {
        playFrom({ start, end }) {
            this.$refs.mediaElement.currentTime = start;
            this.$refs.mediaElement.play();
            setTimeout(() => {
                this.$refs.mediaElement.pause();
            }, (end - start) * 1000);
        },
        notifyTranscription(time) {
            if (this.$refs.mediaElement) this.currentTime = this.$refs.mediaElement.currentTime;
        },
        async loadTranscription(transcription) {
            this.selectedTranscription = transcription;
        },
    },
};
</script>

<style lang="scss" scoped></style>
