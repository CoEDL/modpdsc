<template>
    <div class="flex flex-row h-4">
        <router-link to="/health-check">
            <i class="fas fa-heartbeat"></i> Health Check
        </router-link>
        <router-link to="/about" class="block md:hidden mx-4">
            <i class="fas fa-info-circle"></i> About
        </router-link>
        <div class="flex-grow"></div>
        <div>
            <a href="https://language-archives.services" target="_blank">
                CoEDL Labs
                <i class="fas fa-external-link-alt"></i>
            </a>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    }
};
</script>

<style lang="scss" scoped>
.style-footer-links,
a {
    font-size: 12px;
}
</style>