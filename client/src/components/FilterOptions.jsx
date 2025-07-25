import { useState } from "react";
import { Status } from "../utils/utils";
import "../styles/FilterOptions.css";

const FilterOptions = ( {onFilterChange}) => {

    const [isFilterActive, setIsFilterActive] = useState(false);
    const [currHoveredFilter, setCurrHoveredFilter] = useState(0);
    const [currSelectedFilter, setCurrSelectedFilter] = useState(Status.NONE);

    const handleFilterClick = (status) => {
        setCurrSelectedFilter(status)
        onFilterChange(status)
    }

    return (
    <div className="filter-component">
        <div className="filter-form" onMouseEnter={() => {setIsFilterActive(true)}} onMouseLeave={() => {setIsFilterActive(false)}}>
            {!isFilterActive && <div className="filter-button" onClick={() => {setIsFilterActive(true)}}>Filter</div>}
            {isFilterActive && 
            <>
                <div className="filter-option-container">
                    {Object.values(Status).map((status, index) => (
                        <div className="filter-option" key={status} value={status} onMouseOver={() => {setCurrHoveredFilter(index)}} onClick={() => {handleFilterClick(status)}}>{status}</div>
                    ))}
                </div>
                <div className="dot-container">
                    {Object.values(Status).map((status, index) => (
                        <div className={index === currHoveredFilter ? 'selected dot' : 'dot'} />
                    ))}
                </div>
            </>
            }
        </div>
       <div className="curr-filter-display">
            <div className="curr-filter-text">{!isFilterActive ? currSelectedFilter : "Click to select"}</div>
        </div>
    </div>
    )
}

export default FilterOptions;
