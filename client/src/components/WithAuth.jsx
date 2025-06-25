import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { welcomeRoute } from "../utils/NavigationConsts";

//This is a higher-order component that will wrap other components and check if user is logged in.
//This way, we don't have to add this logic to every necessary page/component
const WithAuth = (WrappedComponent) => {
    return function ProtectedComponent(props) {
        const { user, setUser } = useUser();
        const navigate = useNavigate();

        useEffect(() => {
            if (!user) {
                fetch("http://localhost:3000/me", { credentials: "include" })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.id) { // Ensure the response contains the user id
                            setUser(data); // Set the user in context
                        } else {
                            navigate(welcomeRoute);
                        }
                    })
                    .catch(() => {
                        navigate(welcomeRoute);
                    });
            }
        }, [user, setUser, navigate]);

        //if user is not logged in
        if (!user) { 
            return <p>Loading...</p>; // Prevents flickering before redrection
        }

        return <WrappedComponent {...props} />;
    };
};

export default WithAuth;