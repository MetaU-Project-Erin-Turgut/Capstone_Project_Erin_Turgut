import { useNavigate } from  "react-router";
import "../styles/Header.css"
const Header = () => {

    const navigate = useNavigate();

    return (
        <header className="banner">
            <h1 className="title-text" onClick={() => {
                navigate('/');
            }}>Pivot</h1>
            <div className="welcome-buttons">
                <button onClick={() => {
                    navigate('/signup');
                }}>Sign Up</button>
                <button onClick={() => {
                    navigate('/login');
                }}>Login</button> 
            </div>
        </header>
    )
}


export default Header;