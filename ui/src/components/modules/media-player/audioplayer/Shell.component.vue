<template>
    <div class="flex flex-col bg-indigo-100 rounded p-4">
        <div class="flex flex-col md:flex-row md:space-x-2 my-2">
            <div class="">{{ selectedName }}</div>
            <!-- <copy-to-clipboard-component :data="itemLink" /> -->
            <div class="flex-grow"></div>
            <!-- <el-pagination
                :background="true"
                layout="prev, pager, next"
                :current-page.sync="current"
                :page-size="1"
                :total="total"
                @current-change="update"
            ></el-pagination> -->
        </div>
        <render-audio-element-component
            v-if="selectedName"
            class=""
            :items="audio[selectedName]"
            :name="selectedName"
            :transcriptions="transcriptions[selectedName]"
        />
    </div>
</template>

<script>
import { getFilesByEncoding, getPresignedUrl, getFilesByName } from "../lib";
import { cloneDeep, compact, orderBy, groupBy } from "lodash";
import RenderAudioElementComponent from "./RenderAudioElement.component.vue";
import CopyToClipboardComponent from "@/components/modules/CopyToClipboard.component.vue";

export default {
    components: {
        RenderAudioElementComponent,
        CopyToClipboardComponent,
    },
    props: {
        crate: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            audio: {},
            transcriptions: {},
            current: 1,
            total: undefined,
            selectedName: undefined,
            itemLink: undefined,
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            let audioFiles = getFilesByEncoding({
                crate: this.crate,
                formats: this.$store.state.configuration.ui.audioFormats,
            });

            audioFiles = orderBy(audioFiles, "name");

            if (this.$route.query.transcription) {
                const transcription = this.$route.query.transcription.split(".").shift();
                audioFiles = audioFiles.filter((v) => v.name.split(".").shift() === transcription);
            }
            audioFiles = groupBy(audioFiles, (a) => a["@id"].split(".").shift());

            let transcriptions = getFilesByName({
                crate: this.crate,
                formats: this.$store.state.configuration.ui.transcriptionFileExtensions,
            });
            if (this.$route.query.transcription) {
                const transcription = this.$route.query.transcription;
                transcriptions = transcriptions.filter((t) => t["@id"] === transcription);
            }
            transcriptions = groupBy(transcriptions, (t) => t["@id"].split(".").shift());

            // console.log(JSON.stringify(transcriptions, null, 2));
            // console.log(JSON.stringify(audioFiles, null, 2));
            for (let name of Object.keys(audioFiles)) {
                this.audio[name] = [];
                this.transcriptions[name] = [];
                for (let audioFile of audioFiles[name]) {
                    let url = await getPresignedUrl({
                        $http: this.$http,
                        identifier: this.$route.params.identifier,
                        filename: audioFile["@id"],
                    });
                    this.audio[name].push({
                        ...audioFile,
                        url,
                    });
                }
                for (let transcription of transcriptions[name]) {
                    let url = await getPresignedUrl({
                        $http: this.$http,
                        identifier: this.$route.params.identifier,
                        filename: transcription["@id"],
                    });
                    this.transcriptions[name].push({
                        ...transcription,
                        url,
                    });
                }
            }

            this.total = Object.keys(this.audio).length;
            if (this.$route.hash && this.$route.query?.type === "audio") {
                this.current =
                    Object.keys(this.audio).indexOf(this.$route.hash.replace("#", "")) + 1;
            }
            this.setSelectedFile();
        },
        update(number) {
            this.current = number;
            this.selectedName = undefined;
            this.$nextTick(() => {
                this.setSelectedFile();
            });
        },
        setSelectedFile() {
            this.selectedName = Object.keys(this.audio)[this.current - 1];
            this.$emit("update-route", { hash: `#${this.selectedName}`, type: "audio" });
            this.$nextTick(() => {
                this.itemLink = window.location;
            });
        },
    },
};
</script>
