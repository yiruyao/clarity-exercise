import {FilterItem, FilterType} from "./types";

function isNullOrEmptyString(value: string | undefined) {
    return value === null || value === "" || value === undefined;
}

function isNullOrEmptyArray(values: string[] | undefined) {
    return values === null || values === undefined || values.length === 0 || values.every(isNullOrEmptyString);
}
export function validateFilter(filter: FilterItem) : boolean {
    return !isNullOrEmptyString(filter.operators.value)
        && !isNullOrEmptyArray(filter.input.values)
}