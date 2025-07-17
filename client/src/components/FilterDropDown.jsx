import { useState, useEffect, Suspense } from "react";
import APIUtils from "../utils/APIUtils";
import "../styles/FilterDropDown.css";

const FilterDropDown = ({ onFilterChange }) => {

    const [userInterests, setUserInterests] = useState([]);

    useEffect(() => {
        fetchUserInterests();
    }, [])

    const fetchUserInterests = async () => {
        try {
            const apiResultData = await APIUtils.fetchUserInterests();
            if (apiResultData.length >= 1) {
                setUserInterests(apiResultData);
            }
        } catch (error) {
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
    }

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
                    {userInterests.map((interest) => {
                        return <option key={interest.id} value={interest.id}>{interest.title}</option>
                    })}
                
                </Suspense>
            </select>
        </div>

    )
}


export default FilterDropDown;