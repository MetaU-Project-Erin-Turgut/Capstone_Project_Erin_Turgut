import { useState } from "react";
import NavBar from "../components/NavBar"
import UserResultCard from "../components/UserResultCard";
import APIUtils from "../utils/APIUtils";
import "../styles/SearchResultsPage.css"
import "../styles/CardListContainer.css"

const SearchResultsPage = () => {

    const [searchQuery, setSearchQuery] = useState("");

    const handleQueryChange = (event) => {
        setSearchQuery(event.target.value)
    }

    const handleSearchSubmit = async () => {
        try {
            //get user object results from backend
            const apiResultData = await APIUtils.userSearch(searchQuery);
        } catch (error) {
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
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