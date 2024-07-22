import cx from "classnames";
import React, {useRef, useState} from "react";
import {FilterItem, FilterItemsMap, FilterType, Operator} from '../../../shared/types';

type FilterOption = Record<string, {name: string; icon: string; placeHolder?: string, showCheckbox?: boolean,
    handler?:(event: React.MouseEvent<HTMLDivElement>) => void}>
type SubFilterOption = Record<string, FilterOption>

const AllFilterOptions: FilterOption = {
    keyword: {
        name: "Keyword",
        icon: "bi bi-alphabet",
    },
    customer: {
        name: "Customer",
        icon: "bi bi-person"
    },
    importance: {
        name: "Importance",
        icon: "bi bi-asterisk",
        placeHolder: "Importance..."
    },
    type: {
        name: "Type",
        icon: "bi bi-bookmarks",
        placeHolder: "Type..."
    },
    date: {
        name: "Date",
        icon: "bi bi-calendar"
    },
}

const SubFilterOptions: SubFilterOption = {
    importance: {
        importance_high: {
            name: "High",
            icon:"bi bi-asterisk",
            showCheckbox: true
        },
        importance_medium: {
            name: "Medium",
            icon: "bi bi-asterisk",
            showCheckbox: true
        },
        importance_low: {
            name: "Low",
            icon: "bi bi-asterisk",
            showCheckbox: true
        }
    },
    type: {
        type_research: {
            name: "Research",
            icon: "bi bi-bookmarks",
            showCheckbox: true
        },
        type_sales: {
            name: "Sales",
            icon: "bi bi-bookmarks",
            showCheckbox: true
        },
        type_customer: {
            name: "Customer",
            icon: "bi bi-bookmarks",
            showCheckbox: true
        },
    }
}

export const FilterItemsMap: FilterItemsMap = {
    keyword: {
        type: FilterType.KEYWORD,
        name: "Keyword",
        icon: "bi bi-alphabet",
        operators: {
            value: Operator.CONTAINS,
            options:[
            { value: Operator.CONTAINS, label: 'contains' },
            { value: Operator.NOTCONTAINS, label: 'does not contain' },
                ]
        },
        input: {type: "text"}
    },
    customer: {
        type: FilterType.CUSTOMER,
        name: "Customer",
        icon: "bi bi-person",
        operators: {
            value: Operator.IS,
            options: [{ value: Operator.IS, label: 'is' },
            { value: Operator.ISNOT, label: 'is not' },]
        },
        input: {type: "text"}
    },
    date: {
        type: FilterType.DATE,
        name: "Date",
        icon: "bi bi-calendar",
        operators: {
            value: Operator.IS,
            options: [
            { value: Operator.IS, label: 'is' },
            { value: Operator.BEFORE, label: 'before' },
            { value: Operator.AFTER, label: 'after' },
        ]},
        input: {type: "text"}
    },
    importance: {
        type: FilterType.IMPORTANCE,
        name: "Importance",
        icon: "bi bi-asterisk",
        operators: {
            value: Operator.IS,
            options: [
            { value: Operator.IS, label: 'is any of' },
            { value: Operator.ISNOT, label: 'is not' },
        ]},
        input: {
            type: "select",
            options: [
                { value: 'high', label: 'High', icon: "bi bi-asterisk"},
                { value: 'medium', label: 'Medium', icon: "bi bi-asterisk"},
                { value: 'low', label: 'Low', icon: "bi bi-asterisk"},
            ]
        }
    },
    type: {
        type: FilterType.TYPE,
        name: "Type",
        icon: "bi bi-bookmarks",
        operators: {
            value: Operator.IS,
            options:[
            { value: Operator.IS, label: 'is any of' },
            { value: Operator.ISNOT, label: 'is not' },
        ]},
        input: {
            type: "select",
            options: [
                { value: 'research', label: 'Research', icon: "bi bi-bookmarks",},
                { value: 'sales', label: 'Sales', icon: "bi bi-bookmarks",},
                { value: 'customer', label: 'Customer', icon: "bi bi-bookmarks",},
            ]
        }
    },
}

type Props = {
    addFilterItem: (filter: FilterItem) => void;
};

export function FilterDropdown({addFilterItem}: Props)  {
    const [inputValue, setInputValue] = useState('');
    const [placeHolder, setPlaceHolder] = useState('Filter...');
    const [currentFilterOptions, setFilterOptions] = useState<FilterOption>(AllFilterOptions);
    const allOptionsToFilter = useRef<FilterOption>(AllFilterOptions);

    // Function to handle input change
    const updateInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setInputValue(inputValue);
        if (inputValue === '') {
            setFilterOptions(allOptionsToFilter.current);
        } else {
            setFilterOptions(
                Object.fromEntries(
                    Object.entries(allOptionsToFilter.current).filter(([key, option]) =>
                        (option.name as string).toLowerCase().includes(inputValue.toLowerCase())
                    )
                )
            );
        }
    };

    const filterSelectionHandler = (event: React.MouseEvent<HTMLDivElement>) => {
        const divElement = event.currentTarget;
        const id = divElement.getAttribute('data-id');
        if (id && AllFilterOptions[id] && SubFilterOptions[id]) {
            // show sub filter options
            allOptionsToFilter.current = SubFilterOptions[id];
            setFilterOptions(SubFilterOptions[id])
            setPlaceHolder(AllFilterOptions[id].placeHolder)
        } else {
            // add filter item
            const parts = id.split('_')
            const filterItemKey = parts[0]
            let filterItem = FilterItemsMap[filterItemKey]
            if (parts.length === 2) {
                filterItem.input["values"] = [parts[1]]
            }
            addFilterItem(filterItem)
        }
    }

    const handleCheckboxMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
        event.stopPropagation();
    };

    return (
        <div>
            <input type="text" placeholder={placeHolder} className={cx("outline-none px-1")}
                   value={inputValue} onChange={updateInputValue}/>

            { Object.entries(currentFilterOptions).map(([key, option]) => (
                <div data-id={key} className={cx(
                    "text-gray-text rounded-md flex items-center py-2 px-1 text-sm hover:bg-dusty-white font-medium cursor-default"
                )}
                     onMouseDown={filterSelectionHandler}
                >
                    { option.showCheckbox && <input
                        type="checkbox"
                        className={cx("me-2")}
                        onMouseDown={handleCheckboxMouseDown}
                        // checked={!!checkedOptions[key]}
                        // onChange={(e) => handleCheckboxChange(e, key)}
                    />}
                    <i className={option.icon} style={{ marginRight: '0.3rem' }}></i>
                    {option.name}
                </div>
            ))}
        </div>
    )
}