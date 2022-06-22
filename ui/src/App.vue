<template>
    <div id="app" class="flex flex-col h-screen">
        <router-view />
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
    router.push("/dashboard");
});
</script>
