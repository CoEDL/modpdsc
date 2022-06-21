import "regenerator-runtime";
import "assets/tailwind.css";
// import "assets/global-styles.scss";
import "element-plus/theme-chalk/index.css";
import "@fortawesome/fontawesome-free/js/all";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoReplaceSvg = "nest";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes";
import { store } from "./store";
import ElementPlus from "element-plus";
import log from "loglevel";
import prefix from "loglevel-plugin-prefix";
const level = process.env.NODE_ENV === "development" ? "debug" : "warn";
log.setLevel(level);
const prefixer = prefix.noConflict();
prefixer.reg(log);
prefixer.apply(log);
// import { io } from "socket.io-client";
import HTTPService from "./http.service";

(async () => {
    // let response = await fetch("/api/configuration");
    // if (response.status === 200) {
    //     let configuration = await response.json();
    //     store.commit("saveConfiguration", { ...configuration });
    //     // Vue.config.productionTip = false;
    //     const app = createApp(App);
    //     app.use(store);
    //     app.use(router({ configuration }));
    //     app.use(ElementPlus);
    //     app.config.globalProperties.$http = new HTTPService({ router });
    //     app.provide("$http", app.config.globalProperties.$http);
    //     app.config.globalProperties.$log = log;
    //     app.provide("$log", app.config.globalProperties.$log);
    //     // app.config.globalProperties.$socket = io();
    //     // app.provide('$socket', app.config.globalProperties.$socket)
    //     app.mount("#app");
    // }
})();

// import VueAnalytics from "vue-analytics";

// import * as filters from "./filters";
// const filterNames = Object.keys(filters);
// filterNames.forEach((filter) => Vue.filter(filter, filters[filter]));

// (async () => {
//     await store.dispatch("initialise");
//     const configuration = store.state.configuration;
//     App.router = router({ configuration });
//     App.store = store;

//     Vue.use(VueAnalytics, {
//         id: "UA-79571514-3",
//         debug: {
//             sendHitTask: process.env.NODE_ENV === "production",
//         },
//         router: App.router,
//     });

//     new Vue(App);
// })();
