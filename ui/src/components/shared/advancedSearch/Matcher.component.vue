<template>
    <div class="flex flex-row p-4 text-sm">
        <!-- must match -->
        <div class="w-30 pr-2 border-r border-black">{{ label }} match</div>
        <div class="flex flex-col flex-grow p-1">
            <div v-for="entry of clauses" :key="entry.id">
                <div class="flex flex-col">
                    <div class="flex flew-row flex-grow">
                        <div class="flex-grow">
                            <field-selector-component
                                @update-search="updateSearch"
                                :field-definitions="fieldDefinitions"
                                :id="entry.id"
                            />
                        </div>
                        <div class="ml-1">
                            <el-button
                                type="danger"
                                @click="removeClause({ id: entry.id })"
                                size="small"
                            >
                                <i class="fas fa-fw fa-trash-alt"></i>
                            </el-button>
                        </div>
                    </div>
                    <!-- <div class="text-center">
                        <span v-if="idx !== clause.length - 1">and</span>
                    </div> -->
                </div>
            </div>
            <div class="border-t border-black p-1 mt-2">
                <el-button @click="addClause" size="small">
                    <i class="fas fa-plus"></i>
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
// import { SearchService } from "components/shared/search.service";
import FieldSelectorComponent from "./FieldSelector.component.vue";
import { uniqBy, compact } from "lodash";

export default {
    components: {
        FieldSelectorComponent,
    },
    props: {
        type: {
            type: String,
            required: true,
            validator: (val) => ["must", "mustNot", "should"].includes(val),
        },
        label: {
            type: String,
            required: true,
        },
        fieldDefinitions: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            clauses: [],
        };
    },
    mounted() {
        this.updateSearch();
    },
    methods: {
        addClause() {
            this.clauses.push({ id: Math.random() });
        },
        removeClause({ id }) {
            this.clauses = this.clauses.filter((e) => e.id !== id);
            this.$emit("update-search", { type: this.type, clauses: this.clauses });
        },
        updateSearch(clause) {
            this.clauses = this.clauses.map((e) => (e.id === clause.id ? clause : e));
            this.$emit("update-search", { type: this.type, clauses: this.clauses });
        },
    },
};
</script>

<style lang="scss" scoped></style>
