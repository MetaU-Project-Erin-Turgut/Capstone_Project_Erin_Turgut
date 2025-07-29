import { createContext, useState, useContext } from "react";
import Notification from "../components/Notification";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
     const [message, setMessage] = useState(null);

     return <NotificationContext.Provider value={{message, setMessage}}>
        {message && <Notification message={message} onDropDown={() => {setMessage(null)}}/>}
        {children}
     </NotificationContext.Provider>

}

export const useNotification = () => useContext(NotificationContext);//export as function so that useContext doesn't have to be imported in every component that needs it