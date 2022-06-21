"use strict";

// import Vue from "vue";
// import Vuex from "vuex";
// Vue.use(Vuex);
import { createStore } from "vuex";

// import { DataLoader } from "src/services/data-loader.service";

const mutations = {
    saveApplicationConfiguration(state, configuration) {
        state.configuration = { ...configuration };
    },
    saveStatus(state, status) {
        state.status = { ...status };
    },
    updateFiltersAndQuery(state, payload) {
        state.search.filters = [...payload.filters];
        state.search.query = { ...payload.query };
    },
    updateQueryResults(state, payload) {
        state.search.results = { ...payload };
    },
};

const actions = {
    async initialise({ commit }) {
        // const dataLoader = new DataLoader();
        // const configuration = await dataLoader.getConfiguration();
        // commit("saveApplicationConfiguration", configuration);
        // let status = {
        //     api: undefined,
        //     search: undefined,
        //     ocfl: undefined,
        // };
        // if (configuration.service.api) {
        //     status.api = await dataLoader.verifyApiServiceAvailable({
        //         service: configuration.service.api,
        //     });
        // } else {
        //     status.ocfl = await dataLoader.verifyRepositoryMounted();
        //     status.search = await dataLoader.verifySearchServiceAvailable({
        //         service: configuration.service.search,
        //     });
        // }
        // commit("saveStatus", status);
    },
};
const getters = {};

export const store = new createStore({
    state: resetState(),
    mutations,
    actions,
    modules: {},
});

function resetState() {
    return {
        configuration: {},
        status: {
            api: undefined,
            search: undefined,
            ocfl: undefined,
        },
        search: {
            filters: [],
            query: {},
            results: [],
        },
    };
}
