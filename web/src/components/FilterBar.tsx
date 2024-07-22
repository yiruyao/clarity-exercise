import React, {useEffect, useRef, useState} from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import cx from "classnames";
import {FilterDropdown} from "./FilterDropdown.tsx";
import { FilterItemBox } from "./FilterItemBox.tsx";
import { FilterItemsMap, FilterItem } from '../../../shared/types';

type Props = {
    filterItems: FilterItemsMap;
    updateFilterItems: (filterItems: FilterItemsMap) => void
};
export function FilterBar({filterItems, updateFilterItems}: Props)  {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>();
    const filterRef = useRef<HTMLDivElement>();
    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };
    const handleClickOutside = (event: MouseEvent) => {
        // todo: "type" option is outside of the dropdowRef and won't work with this
        // if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && !filterRef.current.contains(event.target as Node)) {
        //     setDropdownVisible(false);
        // }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const addUpdateFilterItem = (filterItem: FilterItem) => {
        updateFilterItems(prevFilterItems => ({
            ...prevFilterItems,
            [filterItem.type]: filterItem
        }));
        setDropdownVisible(false);
    };

    const removeFilterItem = (filterItem: FilterItem) => {
        const { [filterItem.type]: _, ...remainingFilters } = filterItems;
        updateFilterItems(remainingFilters);
    }

    return (
        <div className={cx("px-6")}>
            {Object.entries(filterItems).map(([type, filter]) => (
                <FilterItemBox filterItem={filter} removeFilterItem={removeFilterItem} addUpdateFilterItem={addUpdateFilterItem}/>
            ))}
            <div className={cx("inline-flex")}>
                <div
                    className={cx(
                        "border-none rounded-lg text-gray-text flex items-center px-1 py-2 text-sm hover:bg-dusty-white cursor-default"
                    )}
                    onMouseDown={toggleDropdown}
                    ref={filterRef}
                >
                    <i
                        className="bi bi-filter"
                        style={{
                            marginRight: Object.keys(filterItems).length === 0 ? "0.3rem" : undefined,
                        }}
                    ></i>
                    {Object.keys(filterItems).length === 0 && "Filter"}
                </div>
                {isDropdownVisible ? (
                    <div
                        className={cx("mx-6 px-2 py-2 absolute w-48 bg-white border-solid border-2 rounded-lg")}
                        ref={dropdownRef}
                    >
                        <FilterDropdown addFilterItem={addUpdateFilterItem} />
                    </div>
                ) : null}
            </div>
        </div>
    )
}