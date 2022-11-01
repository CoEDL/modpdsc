<template>
    <el-radio-group
        class="flex flex-row"
        v-model="data.selectedTranscription"
        @change="loadTranscription"
    >
        <el-radio
            v-for="transcription of props.transcriptions"
            :key="transcription['@id']"
            :label="transcription['@id']"
        >
            {{ transcription["@id"] }}
        </el-radio>
    </el-radio-group>
</template>

<script setup>
import { reactive } from "vue";

const $emit = defineEmits(["load-transcription"]);
const props = defineProps({
    transcriptions: {
        type: Array,
        required: true,
    },
});
const data = reactive({
    selectedTranscription: props.transcriptions[0]["@id"],
});
function loadTranscription(transcription) {
    transcription = props.transcriptions.filter((t) => t["@id"] === transcription)[0];
    $emit("load-transcription", transcription);
}
</script>
