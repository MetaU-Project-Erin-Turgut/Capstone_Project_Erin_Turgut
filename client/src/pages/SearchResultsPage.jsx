import { useState, Suspense, useMemo, useEffect } from "react";
import NavBar from "../components/NavBar"
import UserResultCard from "../components/UserResultCard";
import APIUtils from "../utils/APIUtils";
import "../styles/SearchResultsPage.css"
import "../styles/CardListContainer.css"

const SearchResultsPage = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [notif, setNotif] = useState("User results will show up here..."); //TODO: make notification better appearance and closer to search bar
    const [searchHasBeenClicked, setSearchHasBeenClicked] = useState(false);
    const [autocompleteSuggestions, setAutocompleteSuggestions] = useState(new Set());
    const displayedAutocompleteSuggestions = useMemo(
        () => {
            if (searchQuery === "") {
                return autocompleteSuggestions;
            } else { 
                const filteredSuggestions = Array.from(autocompleteSuggestions).filter((suggestion) => {
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
            setAutocompleteSuggestions(new Set(apiResultData));
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
        if (autocompleteSuggestions.has(searchQuery)) {
            setAutocompleteSuggestions(autocompleteSuggestions.delete(searchQuery))
        }
        if (searchQuery === "") {
            setNotif("You haven't searched for anything!")
        } else {
            setNotif("")
            const prevSetAsArr = new Set(autocompleteSuggestions)
            setAutocompleteSuggestions(new Set([...prevSetAsArr, searchQuery]))
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
            <div className="search-area">
                <form onSubmit={handleSearchSubmit}>
                    <input className="search-input" value={searchQuery} placeholder="Search users..." onClick={() => {if(!searchHasBeenClicked) handleSearchStart();}} onChange={handleQueryChange}/>
                    <button type="submit" className="search-btn">Search</button>
                </form>
                {searchHasBeenClicked &&
                    <Suspense fallback={<p>Loading...</p>}>
                        {Array.from(displayedAutocompleteSuggestions).slice(0).reverse().map((suggestion, index) => { //need to reverse because sets/maps maintain order by insertion and we want order by recency
                            return <div 
                                key={suggestion + index} 
                                className="autocomplete-recommendation">
                                    {suggestion}
                                </div>
                        })}
                    </Suspense>
                } 
            </div>
            
            <div className="user-results-list">
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
        </div>
    )
}

export default SearchResultsPage;