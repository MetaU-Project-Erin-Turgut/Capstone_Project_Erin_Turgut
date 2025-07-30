import { useState } from "react";
import { useNavigate } from  "react-router";
import { useUser } from "../contexts/UserContext";
import { useLoader } from "../contexts/LoadingContext";
import { useNotification } from '../contexts/NotificationContext';
import Header from "../components/Header";
import InputField from "../components/InputField";
import { mainPageRoute } from "../utils/NavigationConsts";
import { DEFAULT_FORM_VALUE, FormFieldPlaceholders } from "../utils/utils";
import APIUtils from "../utils/APIUtils";
import "../styles/SignUpPage.css"

const SignUpPage = () => {
    const { setUser } = useUser();

    const { setIsLoading } = useLoader(); //used to control loading screen during api call
    const { setMessage } = useNotification(); //used to control notification pop up and message

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
        setIsLoading(true);
        try {
            const apiResultData = await APIUtils.handleSignUp(formData);
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
                    <h1 className="title-text">Sign Up</h1>
                </div>
                <div className="input-side">
                    <form onSubmit={handleFormSubmit}>

                        {Object.keys(formData).map((formField) => {
                            return (
                                <InputField
                                    key={formField}
                                    placeholder={FormFieldPlaceholders[formField]}
                                    name={formField}
                                    value={formData[formField]}
                                    onChange={handleInputChange}
                                />
                            )
                        })}

                        <input className="btn" type="submit" value="Submit"></input>
                    </form>
                </div>
            </div>
        </>
    )

}

export default SignUpPage;