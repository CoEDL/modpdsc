<template>
    <div>
        <component v-bind:is="componentFile"></component>
    </div>
</template>

<script>
export default {
    data() {
        return {
            headerComponent: undefined
        };
    },
    computed: {
        componentFile: function() {
            if (!this.headerComponent) return;
            const path = this.headerComponent.match(
                "GenericHeader.component.vue"
            )
                ? ""
                : "/domain";
            return () =>
                import(`src/components${path}/${this.headerComponent}`);
        },
        configuration: function() {
            return this.$store.state.configuration;
        }
    },
    async mounted() {
        this.loadHeader({});
    },
    methods: {
        loadHeader() {
            let { header } = this.configuration;
            if (!header) header = "header/GenericHeader.component.vue";
            this.headerComponent = header;
        }
    }
};
</script>

<style lang="scss" scoped></style>
