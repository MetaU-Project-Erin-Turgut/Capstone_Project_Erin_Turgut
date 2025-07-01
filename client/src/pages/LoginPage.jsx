import { useState } from 'react';
import { useNavigate } from  "react-router";
import { useUser } from "../contexts/UserContext";
import Header from "../components/Header";
import { mainPageRoute } from '../utils/NavigationConsts';
import { DEFAULT_FORM_VALUE } from "../utils/utils";
import APIUtils from '../utils/APIUtils';
import "../styles/SignUpPage.css"


const LoginPage = () => {
    const { setUser } = useUser();

    const [formData, setFormData] = useState({ email: DEFAULT_FORM_VALUE.email, password: DEFAULT_FORM_VALUE.password});
    
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
        loginUser();
    }

    const loginUser = async () => {
        try {
            const apiResultData = await APIUtils.handleLogin(formData);
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
                    <h1 className="title-text">Login</h1>
                </div>

                <div className="input-side">
                    <form onSubmit={handleFormSubmit}>
                        <input 
                            placeholder="Email"
                            type="text"
                            name="email"
                            value={formData.email}
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

export default LoginPage;