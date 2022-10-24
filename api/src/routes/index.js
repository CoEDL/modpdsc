"use strict";

import restifyErrors from "restify-errors";
const { NotFoundError, UnauthorizedError, ForbiddenError } = restifyErrors;
import { loadConfiguration, route, routeAdmin } from "../common/index.js";
import { Store } from "@coedl/nocfl-js";

export function setupRoutes({ server }) {
    server.get("/", (req, res, next) => {
        res.send({});
        next();
    });
    server.get("/configuration", getConfigurationHandler);
    server.get("/collections/:collectionId/metadata", getCollectionMetadataHandler);
    server.get("/collections/:collectionId/items/:itemId/metadata", getItemMetadataHandler);
    server.get("/items/:itemId/metadata", getItemMetadataHandler);
    // server.get("/item/:identifier", async (req, res, next) => {
    //     let configuration = await loadConfiguration();
    //     let store = new Store({
    //         domain: configuration.domain,
    //         className: "item",
    //         id: req.params.identifier,
    //         credentials: configuration.api.s3,
    //     });
    //     // console.log(store);
    //     let crateFile = await store.get({ target: "ro-crate-metadata.json" });
    //     res.send({ roCrate: JSON.parse(crateFile) });
    //     next();
    // });
    // server.get("/item/:identifier/presigned-url", async (req, res, next) => {
    //     let configuration = await loadConfiguration();
    //     let store = new Store({
    //         domain: configuration.domain,
    //         className: "item",
    //         id: req.params.identifier,
    //         credentials: configuration.api.s3,
    //     });
    //     let url = await store.getPresignedUrl({ target: req.query.filename });
    //     console.log(url);
    //     res.send({ url });
    //     next();
    // });
}

async function getConfigurationHandler(req, res, next) {
    let configuration = await loadConfiguration();
    res.send({
        domain: configuration.domain,
        links: configuration.links.toLowerCase() || "default",
        deployment: configuration.deployment.toLowerCase() || "default",
        ui: configuration.ui,
    });
    next();
}

async function getCollectionMetadataHandler(req, res, next) {
    let configuration = await loadConfiguration();
    let store = new Store({
        domain: configuration.domain,
        className: "collection",
        id: req.params.collectionId,
        credentials: configuration.api.s3,
    });

    const exists = await store.itemExists();
    if (!exists) {
        return next(new NotFoundError());
    }
    let crate = await store.getJSON({ target: "ro-crate-metadata.json" });
    res.send({ crate });
    next();
}

async function getItemMetadataHandler(req, res, next) {
    let configuration = await loadConfiguration();

    let identifier;

    if (configuration.links === "paradisec" && req.params.collectionId && req.params.itemId) {
        identifier = `${req.params.collectionId}_${req.params.itemId}`;
    } else {
        identifier = req.params.itemId;
    }

    let store = new Store({
        domain: configuration.domain,
        className: "item",
        id: identifier,
        credentials: configuration.api.s3,
    });

    const exists = await store.itemExists();
    if (!exists) {
        return next(new NotFoundError());
    }
    let crate = await store.getJSON({ target: "ro-crate-metadata.json" });
    res.send({ crate });
    next();
}
