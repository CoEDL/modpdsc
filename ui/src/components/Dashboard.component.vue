<template>
    <div>
        <!-- <introduction-component /> -->
        <!-- <explore-component />
        <header-component />
        <footer-component /> -->
    </div>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import { useStore } from "vuex";
const store = useStore();

const IntroductionComponent = defineAsyncComponent(() =>
    import(`./domain/${store.state.configuration.ui.introduction}`)
);
// const ExploreComponent = defineAsyncComponent(() =>
//     import(`./domain/${store.state.configuration.ui.explore}`)
// );
// const HeaderComponent = defineAsyncComponent(() =>
//     import(`./domain/${store.state.configuration.ui.header}`)
// );
// const FooterComponent = defineAsyncComponent(() =>
//     import(`./domain/${store.state.configuration.ui.footer}`)
// );
</script>
