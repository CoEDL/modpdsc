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
    server.get("/items/:itemId/pre-signed-url/:filename", getItemFilePresignedUrl);
    server.get(
        "/collections/:collectionId/items/:itemId/pre-signed-url/:filename",
        getItemFilePresignedUrl
    );
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

async function getItemFilePresignedUrl(req, res, next) {
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
    let url = await store.getPresignedUrl({ target: req.params.filename });
    res.send({ url });
    next();
}
