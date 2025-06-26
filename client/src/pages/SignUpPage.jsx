import { useState } from "react";
import { useNavigate } from  "react-router";
import { useUser } from "../contexts/UserContext";
import Header from "../components/Header";
import { mainPageRoute } from "../utils/NavigationConsts";
import "../styles/SignUpPage.css"



const SignUpPage = () => {
    const { setUser } = useUser();

    //set these to null instead??
    //move these to a separate component??
    const [formData, setFormData] = useState({ username: "", password: "",  email: ""});

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
            const response = await fetch("http://localhost:3000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data); // Store user session in context
                navigate(mainPageRoute);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
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

                        <input placeholder="First Name"></input><br />
                        <input placeholder="Last Name"></input><br />

                        {/* Handle just these for now  - use enums for 'name'??*/}
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