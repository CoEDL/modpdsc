// import { ROCrate } from "ro-crate";

export function getFilesByEncoding({ formats, rocrate }) {
    //     const crate = new ROCrate(rocrate);
    //     crate.index();
    //     const parts = crate._item_by_type["File"];
    //     return parts.filter((file) => formats.includes(file.encodingFormat));
}

export function getFilesByName({ formats, rocrate }) {
    // const crate = new ROCrate(rocrate);
    // crate.index();
    // const parts = crate._item_by_type["File"];
    // return parts.filter((file) => {
    //     return formats.includes(file.name.split(".").pop());
    // });
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
