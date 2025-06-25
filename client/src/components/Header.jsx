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
            <div className="welcome-buttons">
                <button onClick={() => {
                    navigate(signUpRoute);
                }}>Sign Up</button>
                <button onClick={() => {
                    navigate(loginRoute);
                }}>Login</button> 
            </div>
        </header>
    )
}


export default Header;