import { useNavigate } from  "react-router";
import { searchResultsRoute } from "../utils/NavigationConsts";
import { FaMagnifyingGlass as MagnifyingGlassIcon } from "react-icons/fa6";
import "../styles/SearchForm.css";
const SearchForm = () => {

    const navigate = useNavigate();

    return (
        <div className="search-box">
            <input placeholder="Search users..."/>
            <MagnifyingGlassIcon className="search-icon" onClick={() => navigate(searchResultsRoute)}/>
        </div>
    )
}

export default SearchForm;
