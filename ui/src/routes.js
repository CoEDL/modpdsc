"use strict";

import { createRouter, createWebHistory } from "vue-router";
import ShellComponent from "components/Shell.component.vue";
import BadRequestComponent from "components/BadRequest.component.vue";
import HealthCheckComponent from "components/HealthCheck.component.vue";
import AboutComponent from "components/About.component.vue";
import ExploreComponent from "components/explore/Shell.component.vue";
import IntroductionComponent from "components/introduction/Shell.component.vue";
import ViewComponent from "components/view/Shell.component.vue";
import SupportComponent from "components/support/Shell.component.vue";
import DashboardComponent from "components/Dashboard.component.vue";

export function router({ configuration }) {
    let routes = [
        {
            path: "/",
            name: "root",
            component: ShellComponent,
            children: [
                {
                    path: "collections/:collectionId",
                    component: ViewComponent,
                    props: true,
                },
                {
                    path: "items/:itemId",
                    component: ViewComponent,
                    props: true,
                },
                {
                    path: "collections/:collectionId/items/:itemId",
                    component: ViewComponent,
                    props: true,
                },
            ],
        },
    ];

    const router = createRouter({
        history: createWebHistory("/"),
        routes,
    });
    return router;
}
