import { useNavigate } from  "react-router";
import { welcomeRoute, signUpRoute, loginRoute } from "../utils/NavigationConsts";
import "../styles/Header.css"
const Header = () => {

    const navigate = useNavigate();

    return (
        <header className="banner">
            <h1 className="title-text" onClick={() => {
                navigate(welcomeRoute);
            }}>Pivot</h1>
            <div className="header-buttons">
                <div className="header-btn" onClick={() => {
                    navigate(signUpRoute);
                }}>Sign Up</div>
                <div className="header-btn" onClick={() => {
                    navigate(loginRoute);
                }}>Login</div> 
            </div>
        </header>
    )
}


export default Header;