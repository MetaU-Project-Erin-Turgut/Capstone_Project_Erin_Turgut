import { FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from  "react-router";
import { mainPageRoute, searchResultsRoute } from "../utils/NavigationConsts";
import userSearchIcon from "../assets/search-user-icon.png";
import "../styles/NavBar.css";

const NavBar = ({onMenuClick, isMenuClicked, isMenuVisible, onProfileClick}) => {

    const navigate = useNavigate();

    return (
        <nav className="navigation">
            <div className="nav-section">
                {isMenuVisible && <GiHamburgerMenu className= {isMenuClicked ? "menu-icon clicked" : "menu-icon"} onClick={onMenuClick}/>}
                <h1 className="title-text" onClick={() => {
                    navigate(mainPageRoute);
                }}>Pivot</h1>
            </div>
            <div className="nav-section">
                <img className="search-icon" src={userSearchIcon} onClick={() => {
                    navigate(searchResultsRoute)
                }}/>
                <div className="profile-nav-btns">
                    <FaUserCircle size={50} onClick={onProfileClick}/>
                </div>
            </div>
        </nav>
    )
}

export default NavBar;