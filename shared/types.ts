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

export type Feedback = {
    id: number;
    name: string;
    description: string;
    importance: "High" | "Medium" | "Low";
    type: "Sales" | "Customer" | "Research";
    customer: "Loom" | "Ramp" | "Brex" | "Vanta" | "Notion" | "Linear" | "OpenAI";
    date: string;
};

export type FeedbackData = Feedback[];

export type FeedbackGroup = {
    name: string;
    description: string;
    feedback: Feedback[];
};

