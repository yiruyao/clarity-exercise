
// export type FilterItem
import cx from "classnames";
import React, {useState} from "react";
import Select, {OnChangeValue} from 'react-select';
import {FilterItem, Option} from '../../../shared/types';

type Props = {
    filterItem: FilterItem;
    removeFilterItem: (filterItem: FilterItem) => void;
    addUpdateFilterItem: (filterItem: FilterItem) => void;
};
export function FilterItemBox({filterItem, removeFilterItem, addUpdateFilterItem}: Props) {
    const [inputValue, setInputValue] = useState('');
    const customStyles = {
        option: (base, { isFocused }) => {
            return {
                ...base,
                backgroundColor: isFocused ? "#F5F5F5" : "none",
                color: "black"
            };
        },
        control: base => ({
            ...base,
            border: 0,
            boxShadow: 'none'
        }),
        multiValueRemove: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isFocused ? 'transparent' : base.backgroundColor,
            ':hover': {
                backgroundColor: 'transparent',
            },
        }),
    };
    const handleRemoveFilter = () => {
        removeFilterItem(filterItem)
    };

    const updateInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setInputValue(inputValue);
        filterItem.input['values'] = [inputValue]
        addUpdateFilterItem(filterItem)
    };

    const handleOperatorChange = (option: OnChangeValue<Option, false>) => {
        filterItem.operators['value'] = option.value
        addUpdateFilterItem(filterItem)
    };

    const handleMultiSelectChange = (selectedOptions: Option[]) => {
        filterItem.input['values'] = selectedOptions.map(option => option.value)
        addUpdateFilterItem(filterItem)
    };


    return (
        <div className={cx(
            "text-gray-text rounded-md inline-flex items-center px-1 me-1 text-sm border-1 h-10"
        )}>
            <div className={cx(
                "text-gray-text items-center text-sm flex border-r-1 pe-2 h-full"
            )}>
                <i className={filterItem.icon} style={{ marginRight: '0.3rem' }}></i>
                <span>{filterItem.name}</span>
            </div>
            <div className={cx(
                "text-gray-text items-center text-sm flex border-r-1"
            )}>
                <Select
                    defaultValue={filterItem.operators.options[0]}
                    options={filterItem.operators.options}
                    components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                    styles={customStyles}
                    onChange={option => handleOperatorChange(option)}
                />
            </div>
            { filterItem.input.type === "text" &&
                <div className={cx(
                    "text-gray-text items-center flex text-sm w-15 ps-2 border-r-1 h-full"
                )}>
                    <input type="text" placeholder={filterItem.name || ''} className={cx("outline-none")}
                           value={inputValue} onChange={updateInputValue}
                    />
                </div>
            }
            { filterItem.input.type === "select" &&
              <div className={cx(
                  "text-gray-text items-center text-sm flex border-r-1 h-full"
              )}>
                <Select
                  isMulti
                  defaultValue={filterItem.input.options!![0]}
                  options={filterItem.input.options!!}
                  components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null, ClearIndicator:() => null}}
                  styles={customStyles}
                  onChange={selectedOptions => handleMultiSelectChange(selectedOptions)}
                />
              </div>

            }
            <div className={cx("flex items-center text-sm ps-1")}
            onMouseDown={handleRemoveFilter}>
                <i className="bi bi-x" ></i>
            </div>
        </div>
    )
}