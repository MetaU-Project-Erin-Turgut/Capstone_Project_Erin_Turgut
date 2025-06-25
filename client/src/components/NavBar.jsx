import { useNavigate } from  "react-router";
import { FaUserCircle } from "react-icons/fa";
import { useUser } from "../contexts/UserContext";
import { mainPageRoute, profileRoute } from "../utils/NavigationConsts";
import "../styles/NavBar.css";

const NavBar = () => {

    const { user, setUser } = useUser(); 

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:3000/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                setUser(null); // remove session from react context
                navigate(mainPageRoute);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error("Network error:", error);
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