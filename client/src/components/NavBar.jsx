import { useNavigate } from  "react-router";
import { FaUserCircle } from "react-icons/fa";
import { useUser } from "../contexts/UserContext";
import { mainPageRoute, profileRoute } from "../utils/NavigationConsts";
import { apihandleLogout } from "../utils/APIUtils";
import "../styles/NavBar.css";

const NavBar = () => {

    const { setUser } = useUser(); 

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await apihandleLogout();
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
            <FaUserCircle size={50} onClick={() => {
                navigate(profileRoute);
            }}/>
            <button onClick={handleLogout}>Log Out</button>
        </nav>
    )
}

export default NavBar;