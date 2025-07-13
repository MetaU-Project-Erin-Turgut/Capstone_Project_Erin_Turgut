import { useNavigate } from  "react-router";
import { FaUserCircle } from "react-icons/fa";
import { useUser } from "../contexts/UserContext";
import { mainPageRoute, profileRoute } from "../utils/NavigationConsts";
import SearchForm from "./SearchForm";
import APIUtils from "../utils/APIUtils";
import "../styles/NavBar.css";

const NavBar = ({}) => {

    const { setUser } = useUser(); 

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await APIUtils.handleLogout();
            setUser(null); // remove session from react context
            navigate(mainPageRoute);
        } catch (error) {
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
    }

    return (
        <nav className="navigation">
            <h1 className="title-text" onClick={() => {
                navigate(mainPageRoute);
            }}>Pivot</h1>
            <SearchForm />
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