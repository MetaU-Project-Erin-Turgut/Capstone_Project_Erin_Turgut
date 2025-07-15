import { useState } from "react";
import { useNavigate } from  "react-router";
import { useUser } from "../contexts/UserContext";
import Header from "../components/Header";
import { mainPageRoute } from "../utils/NavigationConsts";
import { DEFAULT_FORM_VALUE } from "../utils/utils";
import APIUtils from "../utils/APIUtils";
import "../styles/SignUpPage.css"

const SignUpPage = () => {
    const { setUser } = useUser();

    const [formData, setFormData] = useState(DEFAULT_FORM_VALUE);

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        signUpUser();
    }

    const signUpUser = async () => {
        try {
            const apiResultData = await APIUtils.handleSignUp(formData);
            setUser(apiResultData); // Store user session in context
            navigate(mainPageRoute);
        } catch (error) {
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
    }


    return (
        <>
            <Header />
            <div className="page-div">
                <div className="title-side">
                    <h1 className="title-text">Sign Up</h1>
                </div>

{/* combine these into a component and use map? */}
                <div className="input-side">
                    <form onSubmit={handleFormSubmit}>
                        <input 
                            placeholder="First Name"
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                        ></input><br />
                        <input 
                            placeholder="Last Name"
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                        ></input><br />
                        <input 
                            placeholder="Address"
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                        ></input><br />
                        <input 
                            placeholder="Email"
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        ></input><br />
                        <input 
                            placeholder="Username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                        ></input><br />
                        <input 
                            placeholder="Password"
                            type="text"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        ></input> <br /> 

                        <input type="submit" value="Submit"></input>
                    </form>
                </div>
            </div>
        </>
    )

}

export default SignUpPage;