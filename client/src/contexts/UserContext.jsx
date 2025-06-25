import { createContext, useState, useContext } from "react";

const UserContext = createContext(); //needed to persist authentication state across the entire app

//this component stores authentication data and allows components to update it
export const UserProvider = ({ children }) => {
    //user state variable will store the user's id and username
    //setUser will update the satate after login or logout
    const [user, setUser] = useState(null);

    return (
        //this allows any component inside it to access the user state var and the function to update it
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext); //components can now easily call useUser() to access login state