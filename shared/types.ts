export interface Option {value: string, label: string, icon?: string}
export enum Operator {
    IS = 'is',
    ISNOT = 'isnot',
    CONTAINS = 'contains',
    NOTCONTAINS = 'notcontains',
    AFTER = 'after',
    BEFORE = 'before',
}

export enum FilterType {
    CUSTOMER = 'customer',
    TYPE = 'type',
    IMPORTANCE = 'importance',
    KEYWORD = 'keyword',
    DATE = 'date',
}

export interface FilterItem {type: FilterType, name: string, icon: string, operators: {options: Option[], value?: string},
    input: {type: string, options?: Option[], values?: string[]}}
export type FilterItemsMap = Record<string, FilterItem>;


