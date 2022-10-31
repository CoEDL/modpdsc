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

export async function getPresignedUrl({ $http, $route, filename }) {
    const { collectionId, itemId } = $route.params;
    let response;
    if (collectionId && itemId) {
        response = await $http.get({
            route: `/collections/${collectionId}/items/${itemId}/pre-signed-url/${filename}`,
        });
        data.type = "item";
    } else if (itemId && !collectionId) {
        response = await $http.get({ route: `/items/${itemId}/pre-signed-url/${filename}` });
    }
    if (response.status === 200) {
        return (await response.json()).url;
    }
    throw new Error(`Unable to get link to ${filename} in storage`);
}
