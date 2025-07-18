import { Status } from "../utils/utils";

const FilterOptions = ( {onFilterChange}) => {

    const handleFilterClick = (event) => {
        onFilterChange(event.target.value)
    }

    return <div className="filter-form">
        {
            Object.values(Status).map((status) => (
                <button className="filter-btn" key={status} value={status} onClick={handleFilterClick}>{status}</button>
            ))
        }
    </div>
}

export default FilterOptions;
