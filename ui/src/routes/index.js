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

export function router({ configuration }) {
    let routes = [
        { path: "/:pathMatch(.*)", name: "404", component: BadRequestComponent },
        {
            name: "HealthCheck",
            path: "/health-check",
            component: HealthCheckComponent,
        },
        {
            name: "About",
            path: "/about",
            component: AboutComponent,
        },
        {
            name: "Support",
            path: "/support",
            component: SupportComponent,
        },
        {
            path: "/",
            component: ShellComponent,
            children: [
                {
                    path: "/",
                    component: IntroductionComponent,
                },
                {
                    path: "explore",
                    component: ExploreComponent,
                },
                {
                    path: "view*",
                    component: ViewComponent,
                },
            ],
        },
    ];
    if (configuration.domain) {
        try {
            let { router } = require(`./${configuration.domain}`);
            routes = router({ routes });
        } catch (error) {
            // do nothing - likely no custom routing for that domain
        }
    }

    const router = createRouter({
        history: createWebHistory("/"),
        routes,
    });

    return router;
}
