import { useState, Suspense } from "react";
import NavBar from "../components/NavBar"
import UserResultCard from "../components/UserResultCard";
import APIUtils from "../utils/APIUtils";
import "../styles/SearchResultsPage.css"
import "../styles/CardListContainer.css"

const SearchResultsPage = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [notif, setNotif] = useState("User results will show up here...")

    const handleQueryChange = (event) => {
        setSearchQuery(event.target.value)
    }

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        setSearchResults([]);
        if (searchQuery === "") {
            setNotif("You haven't searched for anything!")
        } else {
            setNotif("")
            try {
                //get user object results from backend
                const apiResultData = await APIUtils.userSearch(searchQuery);
                if (apiResultData.length === 0) {
                    setNotif("No results found!")
                } else {
                    setSearchResults(apiResultData);
                }
            } catch (error) {
                console.log("Status ", error.status);
                console.log("Error: ", error.message);
            }
        }
        
    }
    
    return (
        <div id="search-page">
            <NavBar />
            <form onSubmit={handleSearchSubmit}>
                <input className="search-input" value={searchQuery} placeholder="Search users..." onChange={handleQueryChange}/>
                <button type="submit" className="search-btn">Search</button>
            </form>
            {searchResults.length < 1 ? <p>{notif}</p> :
                <div className="card-container">
                    <Suspense fallback={<p>Loading...</p>}>
                        {searchResults.map((userObj) => {
                            return <UserResultCard 
                                key={userObj.id}
                                username={userObj.username}
                            />
                        })}
                    </Suspense> 
                </div>
            }
        </div>
    )
}

export default SearchResultsPage;