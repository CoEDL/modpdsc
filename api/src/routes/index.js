"use strict";

import restifyErrors from "restify-errors";
const { UnauthorizedError, ForbiddenError } = restifyErrors;
import { loadConfiguration, route, routeAdmin } from "../common/index.js";

export function setupRoutes({ server }) {
    server.get("/", (req, res, next) => {
        res.send({});
        next();
    });
    server.get("/configuration", async (req, res, next) => {
        let configuration = await loadConfiguration();
        // configuration = filterPrivateInformation({ configuration });
        console.log(configuration);
        res.send({
            ui: configuration.ui,
        });
        next();
    });
}
