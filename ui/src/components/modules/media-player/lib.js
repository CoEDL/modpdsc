// import { ROCrate } from "ro-crate";
import { CrateManager } from "@/crate-manager.js";

export function getFilesByEncoding({ formats, crate }) {
    crate = new CrateManager({ crate });
    let rootDataset = crate.getRootDataset();
    let parts = rootDataset.hasPart
        .map((file) => crate.getEntity({ id: file["@id"] }))
        .filter((file) => formats.includes(file.encodingFormat));
    return parts;
}

export function getFilesByName({ formats, crate }) {
    crate = new CrateManager({ crate });
    let rootDataset = crate.getRootDataset();
    return rootDataset.hasPart.filter((file) => {
        return formats.includes(file["@id"].split(".").pop());
    });
}

export function updateRouterLocation({ router, route, hash, type }) {
    if (route.hash === `#${hash}` && route.query?.type === type) return window.location;
    router.replace({
        hash,
        query: {
            ...route.query,
            type,
        },
    });
    return window.location;
}

export async function getPresignedUrl({ $http, identifier, filename }) {
    let response = await $http.get({
        route: `/item/${identifier}/presigned-url`,
        params: { filename },
    });
    if (response.status === 200) {
        return (await response.json()).url;
    }
    throw new Error(`Unable to get link to ${filename} in storage`);
}
