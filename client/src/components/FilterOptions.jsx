import { Status } from "../utils/utils";

const FilterOptions = ( {filterEvents}) => {

    const handleFilterClick = (event) => {
        filterEvents(event.target.value)
    }

    return <div className="filter-form">
        <button value={Status.PENDING} onClick={handleFilterClick}>{Status.PENDING}</button>
        <button value={Status.ACCEPTED} onClick={handleFilterClick}>{Status.ACCEPTED}</button>
        <button value={Status.REJECTED} onClick={handleFilterClick}>{Status.REJECTED}</button>
    </div>
}

export default FilterOptions;