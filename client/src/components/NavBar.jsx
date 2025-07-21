import { useNavigate } from  "react-router";
import { FaUserCircle } from "react-icons/fa";
import { useUser } from "../contexts/UserContext";
import { mainPageRoute, profileRoute, searchResultsRoute } from "../utils/NavigationConsts";
import { useLoader } from "../contexts/LoadingContext";
/* userSearchIcon retrieved from: https://pngtree.com/so/search-user
 and background cleared using https://www.remove.bg/ */
import userSearchIcon from "../assets/search-user-icon.png";
import APIUtils from "../utils/APIUtils";
import "../styles/NavBar.css";

const NavBar = ({}) => {

    const { setUser } = useUser(); 

    const { setIsLoading } = useLoader(); //used to control loading screen during api call

    const navigate = useNavigate();

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await APIUtils.handleLogout();
            setUser(null); // remove session from react context
            navigate(mainPageRoute);
        } catch (error) {
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
        setIsLoading(false);
    }

    return (
        <nav className="navigation">
            <h1 className="title-text" onClick={() => {
                navigate(mainPageRoute);
            }}>Pivot</h1>
            <img className="search-icon" src={userSearchIcon} onClick={() => {
                navigate(searchResultsRoute)
            }}/>
            <div className="profile-nav-btns">
                <FaUserCircle size={50} onClick={() => {
                    navigate(profileRoute);
                }}/>
                <button onClick={handleLogout}>Log Out</button>
            </div>
        </nav>
    )
}

export default NavBar;