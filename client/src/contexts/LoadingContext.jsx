import { createContext, useState } from "react";
import LoadingPage from "../pages/LoadingPage";

export const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
     const [isLoading, setIsLoading] = useState(false);

     return <LoadingContext.Provider value={{isLoading, setIsLoading}}>
        {isLoading && <LoadingPage />}
        {children}
     </LoadingContext.Provider>

}