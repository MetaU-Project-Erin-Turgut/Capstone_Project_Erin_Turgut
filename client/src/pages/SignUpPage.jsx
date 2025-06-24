import { useNavigate } from  "react-router";
import Header from "../components/Header";
import "../styles/SignUpPage.css"
const SignUpPage = () => {

    const navigate = useNavigate();

    return (
        <>
            <Header />
            <div className="page-div">
                <div className="title-side">
                    <h1 className="caprasimo-regular">Sign Up</h1>
                </div>

                <div className="input-side">
                    <form>
                        <input placeholder="First Name"></input><br />
                        <input placeholder="Last Name"></input><br />
                        <input placeholder="Email"></input><br />
                        <input placeholder="Phone number"></input><br />

                        <input placeholder="Username"></input><br />
                        <input placeholder="Password"></input> <br /> 

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

export default SignUpPage;