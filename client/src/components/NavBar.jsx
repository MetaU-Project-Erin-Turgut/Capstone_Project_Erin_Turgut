import { useNavigate } from  "react-router";
import { FaUserCircle } from "react-icons/fa";
import "../styles/NavBar.css";

const NavBar = () => {

    const navigate = useNavigate();

    return (
        <nav className="navigation">
            <h1 className="caprasimo-regular" onClick={() => {
                navigate('/main');
            }}>Pivot</h1>
            <FaUserCircle size={50} onClick={() => {
                navigate('/profile');
            }}/>
        </nav>
    )
}

export default NavBar;