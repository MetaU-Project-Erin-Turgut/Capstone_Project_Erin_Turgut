import { useNavigate } from  "react-router";
import { signUpRoute, loginRoute } from "../utils/NavigationConsts";import "../styles/WelcomePage.css"

//This is the page that loads on start up - welcoming user to the app
const WelcomePage = () => {

    const navigate = useNavigate();

    return (
        <>
            <div className="welcome-div">
                <div className="welcome-title">
                    <h1 className="title-text">Pivot</h1>
                    <h2>A social app that gets rid of the hardest part: 
                        <br></br>the first step.
                    </h2>
                </div>

                <div className="welcome-buttons">
                    <div className="welcome-btn" onClick={() => {
                        navigate(signUpRoute);
                    }}>Sign Up</div>
                    <div className="welcome-btn" onClick={() => {
                        navigate(loginRoute);
                    }}>Login</div> 
                </div>
            </div>
        </>
    )
}

export default WelcomePage;