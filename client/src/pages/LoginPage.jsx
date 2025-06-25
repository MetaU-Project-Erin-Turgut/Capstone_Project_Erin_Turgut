import { useNavigate } from  "react-router";
import Header from "../components/Header";
import "../styles/SignUpPage.css"

const LoginPage = () => {

    const navigate = useNavigate();

    return (
        <>
            <Header />
            <div className="page-div">
                <div className="title-side">
                    <h1 className="title-text">Login</h1>
                </div>

                <div className="input-side">
                    <form>
                        <input placeholder="Username"></input><br />
                        <input placeholder="Password"></input><br />

                        {/* The below button is temporary */}
                        <button onClick={() => {
                            navigate('/main');
                        }}>Temp Button Submit</button>

                        {/* <input type="submit" value="Submit"></input> */}
                    </form>
                </div>
            </div>
        </>
    )

}

export default LoginPage;