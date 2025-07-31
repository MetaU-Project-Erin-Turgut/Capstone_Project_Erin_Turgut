import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { useUser } from "../contexts/UserContext";
import { useLoader } from "../contexts/LoadingContext";
import { useNavigate } from  "react-router";
import { mainPageRoute, searchResultsRoute, profileRoute } from "../utils/NavigationConsts";
import SideBar from "../components/SideBar";
import ProfileDropDown from "./ProfileDropDown";
import userSearchIcon from "../assets/search-user-icon.png";
import APIUtils from '../utils/APIUtils';
import "../styles/NavBar.css";

const NavBar = ({ isMenuVisible, onSelectTab }) => {

    const navigate = useNavigate();

    const { setUser } = useUser(); 
    const { setIsLoading } = useLoader(); //used to control loading screen during api call
    
    const [isSideBarVisible, setIsSideBarVisible] = useState(false);
    const [isProfileDropDownVisible, setIsProfileDropDownVisible] = useState(false);
    

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
        <>
            {/* nav bar */}
            <nav className="navigation">
                <div className="nav-section">
                    {isMenuVisible && <GiHamburgerMenu className= {isSideBarVisible ? "menu-icon clicked" : "menu-icon"} onClick={() => {setIsSideBarVisible((prev) => !prev)}}/>}
                    <h1 className="title-text" onClick={() => {
                        navigate(mainPageRoute);
                    }}>Pivot</h1>
                </div>
                <div className="nav-section">
                    <img className="search-icon" src={userSearchIcon} onClick={() => {
                        navigate(searchResultsRoute)
                    }}/>
                    <div className="profile-nav-btns">
                        <FaUserCircle size={50} onClick={() => {setIsProfileDropDownVisible((prev) => !prev)}}/>
                    </div>
                </div>
            </nav>

            {/* main menu dropdown */}
            {isSideBarVisible && <SideBar handleTabSelect={(tabName) => {
                onSelectTab(tabName);
                setIsSideBarVisible(!isSideBarVisible);
            }}/>}
            
            {/* profile menu dropdown */}
            {isProfileDropDownVisible && <ProfileDropDown 
                onProfileNav={() => {navigate(profileRoute); setIsProfileDropDownVisible(false);}}
                onLogout={() => {handleLogout(); setIsProfileDropDownVisible(false);}}
            />}
        </>
    )
}

export default NavBar;