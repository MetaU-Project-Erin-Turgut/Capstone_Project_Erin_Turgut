import { Suspense } from "react";
import "../styles/FilterDropDown.css";

const FilterDropDown = ({ onFilterChange, userInterests }) => {
    const handleSelect = (event) => {
        onFilterChange(event.target.value)
    }

    return (
        <div className="filter-container">
            <label>Filter by your interests:</label>
            <select name="interests" id="interests" defaultValue="" onChange={handleSelect}>
                <option disabled value="">Select interest...</option>
                <option value={-1}>None</option>
                <Suspense fallback={<p>Loading...</p>}>
                    {Array.from(userInterests.entries()).map(([key, value]) => {
                        return <option key={key} value={value.id}>{value.title} {value.tally}</option>
                    })}
                </Suspense>
            </select>
        </div>

    )
}


export default FilterDropDown;