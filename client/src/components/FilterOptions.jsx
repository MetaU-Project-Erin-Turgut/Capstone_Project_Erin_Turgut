import { Status } from "../utils/utils";

const FilterOptions = ( {filterEvents}) => {

    const handleFilterClick = (event) => {
        filterEvents(event.target.value)
    }

    return <div className="filter-form">
        {
            Object.values(Status).map((status, index) => (
                <button key={index} value={status} onClick={handleFilterClick}>{status}</button>
            ))
        }
    </div>
}

export default FilterOptions;
