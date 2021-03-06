"use strict";

import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import { DataLoader } from "src/services/data-loader.service";

const configuration = {
    strict: process.env.NODE_ENV !== "production",
    state: {
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
    },
    mutations: {
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
    },
    actions: {
        async initialise({ commit }) {
            const dataLoader = new DataLoader();
            const configuration = await dataLoader.getConfiguration();
            commit("saveApplicationConfiguration", configuration);
            let status = {
                api: undefined,
                search: undefined,
                ocfl: undefined,
            };
            if (configuration.service.api) {
                status.api = await dataLoader.verifyApiServiceAvailable({
                    service: configuration.service.api,
                });
            } else {
                status.ocfl = await dataLoader.verifyRepositoryMounted();
                status.search = await dataLoader.verifySearchServiceAvailable({
                    service: configuration.service.search,
                });
            }
            commit("saveStatus", status);
        },
    },
    getters: {},
};
export const store = new Vuex.Store(configuration);
