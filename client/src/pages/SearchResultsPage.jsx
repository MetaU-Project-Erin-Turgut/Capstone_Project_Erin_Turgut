import { useState } from "react";
import NavBar from "../components/NavBar"
import UserResultCard from "../components/UserResultCard";
import "../styles/SearchResultsPage.css"
import "../styles/CardListContainer.css"

const SearchResultsPage = () => {

    const [searchQuery, setSearchQuery] = useState("");

    const handleQueryChange = (event) => {
        setSearchQuery(event.target.value)
    }

    const handleSearchSubmit = () => {

    }
    
    return (
        <div id="search-page">
            <NavBar />
            <input className="search-input" value={searchQuery} placeholder="Search users..." onChange={handleQueryChange}/>
            <button className="search-btn" onClick={handleSearchSubmit}>Search</button>
            <p>User results will show up here...</p>
            <div className="card-container">
                <UserResultCard />
                <UserResultCard />
                <UserResultCard />
            </div>
        </div>
    )
}

export default SearchResultsPage;