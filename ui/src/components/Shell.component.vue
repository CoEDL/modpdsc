<template>
    <div class="flex flex-col">
        <navbar-component class="bg-sky-100" />
        <router-view />
    </div>
</template>

<script setup>
import NavbarComponent from "./Navbar.component.vue";
</script>
