import { useState } from 'react';
import { useNavigate } from  "react-router";
import { useUser } from "../contexts/UserContext";
import Header from "../components/Header";
import { mainPageRoute } from '../utils/NavigationConsts';
import "../styles/SignUpPage.css"


const LoginPage = () => {
    const { setUser } = useUser();

    const [formData, setFormData] = useState({ email: "", password: ""});
    
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
            const response = await fetch("http://localhost:3000/login", {
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