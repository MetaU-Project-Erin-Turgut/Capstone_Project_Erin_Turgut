import { createContext, useState, useContext } from "react";
import LoadingPage from "../pages/LoadingPage";

export const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
     const [isLoading, setIsLoading] = useState(false);

     return <LoadingContext.Provider value={{isLoading, setIsLoading}}>
        {isLoading && <LoadingPage />}
        {children}
     </LoadingContext.Provider>

}

export const useLoader = () => useContext(LoadingContext);//export as function so that useContext doesn't have to be imported in every component that needs it