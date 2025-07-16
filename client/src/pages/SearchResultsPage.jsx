import { useState, Suspense, useMemo, useEffect } from "react";
import NavBar from "../components/NavBar"
import UserResultCard from "../components/UserResultCard";
import APIUtils from "../utils/APIUtils";
import "../styles/SearchResultsPage.css"
import "../styles/CardListContainer.css"

const SearchResultsPage = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [notif, setNotif] = useState("User results will show up here...");
    const [searchHasBeenClicked, setSearchHasBeenClicked] = useState(false);
    const [autocompleteSuggestions, setAutocompleteSuggestions] = useState(new Set());
    const displayedAutocompleteSuggestions = useMemo(
        () => {
            if (searchQuery === "") {
                return autocompleteSuggestions;
            } else { 
                const filteredSuggestions = autocompleteSuggestions.filter((suggestion) => {
                    return suggestion.startsWith(searchQuery)
                })
                return filteredSuggestions
            }
            
        },
        [autocompleteSuggestions, searchQuery]
    );

    useEffect(() => {
        fetchAutocompleteSuggestions();
    }, []);

    const fetchAutocompleteSuggestions = async () => {
        try {
            //get suggested searches for autocomplete/typeahead
            const apiResultData = await APIUtils.userSearchTypeAhead();
            setAutocompleteSuggestions(apiResultData);
        } catch (error) {
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
    }

    const handleQueryChange = (event) => {
        if (!searchHasBeenClicked && searchQuery === "") setNotif("");
        setSearchQuery(event.target.value)
    }

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        setSearchResults([]);
        if (searchQuery === "") {
            setNotif("You haven't searched for anything!")
        } else {
            setNotif("")
            setAutocompleteSuggestions(prev => [searchQuery, ...prev])
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

    const handleSearchStart = async () => {
        setSearchHasBeenClicked(true);
        setNotif("");
    }
    
    return (
        <div id="search-page">
            <NavBar />
            <form onSubmit={handleSearchSubmit}>
                <input className="search-input" value={searchQuery} placeholder="Search users..." onClick={() => {if(!searchHasBeenClicked) handleSearchStart();}} onChange={handleQueryChange}/>
                <button type="submit" className="search-btn">Search</button>
            </form>
            {searchHasBeenClicked &&
                <Suspense fallback={<p>Loading...</p>}>
                    {displayedAutocompleteSuggestions.map((suggestion) => {
                        return <p>{suggestion}</p>
                    })}
                </Suspense>
            }   
            {searchResults.length < 1 ? <p>{notif}</p> :
                <div className="card-container">
                    <Suspense fallback={<p>Loading...</p>}>
                        {searchResults.map((userObj) => {
                            return <UserResultCard 
                                key={userObj.id}
                                username={userObj.username}
                                numMutualGroups={userObj.numMutualGroups}
                            />
                        })}
                    </Suspense> 
                </div>
            }
        </div>
    )
}

export default SearchResultsPage;