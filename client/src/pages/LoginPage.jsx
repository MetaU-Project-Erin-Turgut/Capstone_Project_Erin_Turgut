import { useState } from 'react';
import { useNavigate } from  "react-router";
import { useUser } from "../contexts/UserContext";
import { useLoader } from '../contexts/LoadingContext';
import { useNotification } from '../contexts/NotificationContext';
import Header from "../components/Header";
import InputField from '../components/InputField';
import { mainPageRoute } from '../utils/NavigationConsts';
import { DEFAULT_FORM_VALUE } from "../utils/utils";
import APIUtils from '../utils/APIUtils';
import "../styles/SignUpPage.css"

const LoginPage = () => {
    const { setUser } = useUser();

    const { setIsLoading } = useLoader(); //used to control loading screen during api call
    const { setMessage } = useNotification(); //used to control notification pop up and message

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
        setIsLoading(true);
        try {
            const apiResultData = await APIUtils.handleLogin(formData);
            setUser(apiResultData); // Store user session in context
            navigate(mainPageRoute);
        } catch (error) {
            setMessage(error.message)
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
        setIsLoading(false);
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
                        <InputField
                            key="email"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        <InputField
                            key="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        <input className="btn" type="submit" value="Submit"></input>
                    </form>
                </div>
            </div>
        </>
    )

}

export default LoginPage;