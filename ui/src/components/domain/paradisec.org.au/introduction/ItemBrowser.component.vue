<template>
    <div class="p-4">
        <div class="text-center">sample items in this demonstrator</div>
        <div class="my-4 flex flex-col">
            <div class="flex flex-col">
                <div class="underline">Collections</div>
                <div class="flex flex-row flex-wrap">
                    <el-tag
                        v-for="(collection, idx) of collections"
                        :key="idx"
                        class="m-1"
                        size="small"
                    >
                        <router-link :to="route(collection)">{{
                            collection
                        }}</router-link>
                    </el-tag>
                </div>
            </div>
            <div class="flex flex-col mt-2">
                <div class="underline">Items</div>
                <div class="flex flex-row flex-wrap">
                    <el-tag
                        v-for="(item, idx) of items"
                        :key="idx"
                        class="m-1"
                        size="small"
                    >
                        <router-link :to="route(item)">{{ item }}</router-link>
                    </el-tag>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            collections: ["AC1", "NT1", "NT3", "NT5", "NT6", "WDVA1", "SN1"],
            items: [
                "AC1/001",
                "AC1/002",
                "NT1/005",
                "NT1/20003",
                "NT1/2004",
                "NT1/98001",
                "NT1/98007",
                "NT1/98009",
                "NT1/98017",
                "NT3/nafakoron",
                "NT3/SESAKE",
                "NT5/TokelauOf",
                "NT6/2005V001",
                "PAMBU/DOC1014",
                "SN1/MM20130708Museum",
                "WDVA1/MIR_07",
                "WDVA1/TJILK05",
            ],
        };
    },
    methods: {
        route(target) {
            return `/view/${target}`;
        },
    },
};
</script>

<style lang="scss" scoped></style>
