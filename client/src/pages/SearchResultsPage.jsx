import { useState, Suspense, useMemo, useEffect, useRef } from "react";
import NavBar from "../components/NavBar"
import UserResultCard from "../components/UserResultCard";
import FilterDropDown from "../components/FilterDropDown";
import APIUtils from "../utils/APIUtils";
import "../styles/SearchResultsPage.css"
import "../styles/CardListContainer.css"

const SearchResultsPage = () => {
    let searchIsReset = false; //set to true when search is triggered - NOT when load more is triggered
    const [userInterestMap, setUserInterestMap] = useState(new Map()); //map of user interest selected ids (keys) to the interest object. tallies for each will be loaded on backend
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [interestIdFilter, setInterestIdFilter] = useState(-1); //interest id used for filtering user resukts by ones that have this selected interest
    const [notif, setNotif] = useState("User results will show up here..."); //TODO: make notification better appearance and closer to search bar
    const [isDisplayedAutocompleteSuggestions, setIsDisplayedAutocompleteSuggestions] = useState(false);
    const [autocompleteSuggestions, setAutocompleteSuggestions] = useState(new Set());
    const [isLoadMoreHidden, setIsLoadMoreHidden] = useState(false);
    const pageMarker = useRef('HL0'); //'HL' means higher level cache. 'LL' means lower level cache. the number at the end of the pageMarker is the index
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
    const displayedSearchResults = useMemo(
        () => {
            if (interestIdFilter === -1) return searchResults;
            const filteredSearchResults = searchResults.filter((user) =>
                user.interests.includes(interestIdFilter)
            )
            return filteredSearchResults;
        },
        [searchResults, interestIdFilter]
    )

    useEffect(() => {
        fetchAutocompleteSuggestions();
        fetchUserInterests();
    }, []);

    const fetchUserInterests = async () => {
        try {
            const apiResultData = await APIUtils.fetchUserInterests();
            let tempMap = new Map();
            if (apiResultData.length >= 1) {
                for (let i = 0; i < apiResultData.length; i++) {
                    tempMap.set(apiResultData[i].id, apiResultData[i]);
                }
            }
            setUserInterestMap(tempMap);
        } catch (error) {
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
    }

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
        if (!isDisplayedAutocompleteSuggestions && searchQuery === "") setNotif("");
        setSearchQuery(event.target.value)
    }

    const handleSearchSubmit = async (suggestion) => {
        if (searchQuery === "" && suggestion === undefined) { //suggestion is defined if a search query occurred by clicking on an autocomplete suggestion
            setNotif("You haven't searched for anything!")
        } else {
            if (autocompleteSuggestions.has(searchQuery)) {
                setAutocompleteSuggestions(autocompleteSuggestions.delete(searchQuery)) //will move to make more recent, but delete first to avoid duplicates
            }
            setNotif("")
            //append new query to set of autocomplete suggestions - will be reversed on render to show as the most recent
            const prevSetAsArr = new Set(autocompleteSuggestions)
            if (searchQuery === "") {
                setAutocompleteSuggestions(new Set([...prevSetAsArr, suggestion]))
            } else {
                setAutocompleteSuggestions(new Set([...prevSetAsArr, searchQuery]))
            }

            try {
                //get user object results from backend
                let apiResultData = {}
                let objUserInterests = {}
                if(searchIsReset) { //if it's a new search and not just load more, then send user's selected interests to the backend.
                    objUserInterests = {
                        userInterests: Array.from(userInterestMap.keys())
                    }
                } else {
                    objUserInterests = {
                        userInterests: []
                    }
                }

                if (searchQuery === "") {
                    apiResultData = await APIUtils.userSearch(suggestion, pageMarker.current, objUserInterests);
                } else {
                    apiResultData = await APIUtils.userSearch(searchQuery, pageMarker.current, objUserInterests);
                }
                
                setIsLoadMoreHidden(apiResultData.newPageMarker === 'END');

                pageMarker.current = apiResultData.newPageMarker;

                //update userInterest map with tallies from backend
                if (apiResultData.userInterestMap) {
                    let updatedUserInterestMap = new Map()
                    for (let i = 0; i < apiResultData.userInterestMap.length; i++) {
                        updatedUserInterestMap.set(apiResultData.userInterestMap[i][0], {...userInterestMap.get(apiResultData.userInterestMap[i][0]), tally: apiResultData.userInterestMap[i][1]})
                    }
                
                    setUserInterestMap(updatedUserInterestMap);
                }

                if (apiResultData.results.length === 0) {
                    setNotif("No results found!")
                } else {
                    if (searchIsReset) {
                        setSearchResults(apiResultData.results);
                    } else {
                        //handling duplicate data:
                        const currentResultsIds = new Set(searchResults.map((currResult) => currResult.id));
                        const filteredNewResults = apiResultData.results.filter((newResult) => {
                            return !currentResultsIds.has(newResult.id) //having created a set makes this operation O(1)
                        })
                        setSearchResults([...searchResults, ...filteredNewResults]);
                    }
                }
                searchIsReset = false;
            } catch (error) {
                console.log("Status ", error.status);
                console.log("Error: ", error.message);
            }
        }

    }


    return (
        <div id="search-page">
            <NavBar />
            <div className="search-area">
                <FilterDropDown onFilterChange={(filter) => { setInterestIdFilter(parseInt(filter)) }} userInterests={userInterestMap}/>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    searchIsReset = true;
                    pageMarker.current = 'HL0';
                    handleSearchSubmit();
                }}>
                    <input className="search-input" value={searchQuery} placeholder="Search users..." onFocus={() => setIsDisplayedAutocompleteSuggestions(true)} onBlur={(event) => setIsDisplayedAutocompleteSuggestions(false)} onChange={handleQueryChange} />
                    <button type="submit" className="search-btn">Search</button>
                </form>
                {isDisplayedAutocompleteSuggestions &&
                    <Suspense fallback={<p>Loading...</p>}>
                        {Array.from(displayedAutocompleteSuggestions).slice(0).reverse().slice(0, 5).map((suggestion, index) => { //need to reverse because sets/maps maintain order by insertion and we want order by recency
                            return <div
                                className="autocomplete-recommendation"
                                key={suggestion + index}
                                onMouseDown={() => { //used onMouseDown to activate before onBlur
                                    setSearchQuery(suggestion);
                                    pageMarker.current = 'HL0';
                                    searchIsReset = true;
                                    handleSearchSubmit(suggestion);
                                }}
                            >
                                {suggestion}
                            </div>
                        })}
                    </Suspense>
                }
            </div>

            <div className="user-results-list">
                {searchResults.length < 1 ? <p className="notif-para">{notif}</p> :
                    <div className="card-container">
                        <Suspense fallback={<p>Loading...</p>}>
                            {displayedSearchResults.map((userObj) => {
                                return <UserResultCard
                                    key={userObj.id}
                                    username={userObj.username}
                                    numMutualGroups={userObj.numMutualGroups}
                                />
                            })}
                        </Suspense>
                    </div>
                }
                {!isLoadMoreHidden && <button className="load-more-btn" onClick={handleSearchSubmit}>Load More</button>}
            </div>
        </div>
    )
}

export default SearchResultsPage;