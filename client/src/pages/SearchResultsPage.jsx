import { useState } from "react";
import NavBar from "../components/NavBar"
import "../styles/SearchResultsPage.css"

const SearchResultsPage = () => {

    const [searchQuery, setSearchQuery] = useState("");

    const handleQueryChange = (event) => {
        setSearchQuery(event.target.value)
    }

    const handleSearchSubmit = () => {
        
    }
    
    return (
        <div id="search-results-page">
            <NavBar />
            <input className="search-input" value={searchQuery} placeholder="Search users..." onChange={handleQueryChange}/>
            <button className="search-btn" onClick={handleSearchSubmit}>Search</button>
            <p>User results will show up here...</p>
        </div>
    )
}

export default SearchResultsPage;