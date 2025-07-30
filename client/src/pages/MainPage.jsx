import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from  "react-router";
import { useUser } from "../contexts/UserContext";
import { useLoader } from "../contexts/LoadingContext";
import { useNotification } from '../contexts/NotificationContext';
import { profileRoute } from "../utils/NavigationConsts";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import EventsList from './EventsList';
import GroupsList from './GroupsList';
import InterestList from './InterestList';
import ProfileDropDown from '../components/ProfileDropDown';
import APIUtils from '../utils/APIUtils';
import { Tab } from "../utils/utils";

const MainPage = () => {

    const navigate = useNavigate();

    const { setMessage } = useNotification(); //used to control notification pop up and message
    const { setUser } = useUser(); 
    const { setIsLoading } = useLoader(); //used to control loading screen during api call

    const [userEventTypeTallies, setUserEventTypeTallies] = useState([]);
    const [selectedTab, setSelectedTab] = useState(Tab.EVENTS);
    const [isSideBarVisible, setIsSideBarVisible] = useState(false);
    const [isProfileDropDownVisible, setIsProfileDropDownVisible] = useState(false);

    const userTopEventType = useMemo(
        () => { 
            let currFavEventType = -1;
            let currMax = 0
            for (let i = 0; i < userEventTypeTallies.length; i++) {
                if (userEventTypeTallies[i] > currMax) {
                    currFavEventType = i;
                    currMax = userEventTypeTallies[i]
                }
            }
            return currFavEventType;
        },
        [userEventTypeTallies]
    )

    useEffect(() => {
        fetchUserEventTypeTallies();
    }, []);

    const fetchUserEventTypeTallies = async () => {
        try {
            const apiResultData = await APIUtils.fetchUserEventTypeTallies();
            (apiResultData)
            setUserEventTypeTallies(apiResultData.eventTypeTallies);
        } catch (error) {
            setMessage(error.message)
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
    }

    const newDisplay = () => {
        switch(selectedTab) {
            case Tab.EVENTS: 
                return <EventsList userTopEventType={userTopEventType} />
            case Tab.GROUPS: 
                return <GroupsList />
            case Tab.INTERESTS:
                return <InterestList />
            default:
                return <h2>No Tab Selected!</h2>
        }
    }

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await APIUtils.handleLogout();
            setUser(null); // remove session from react context
            navigate(mainPageRoute);
        } catch (error) {
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
        setIsLoading(false);
    }

    return (
        <div id="main-page">
            <NavBar isMenuClicked={isSideBarVisible} isMenuVisible={true} onMenuClick={() => {setIsSideBarVisible((prev) => !prev)}} onProfileClick={() => {setIsProfileDropDownVisible((prev) => !prev)}}/>
            {isSideBarVisible && <SideBar handleTabSelect={(tabName) => {
                setSelectedTab(tabName);
                setIsSideBarVisible(!isSideBarVisible)
            }}/>}
            {isProfileDropDownVisible && <ProfileDropDown 
                onProfileNav={() => {navigate(profileRoute); setIsProfileDropDownVisible(false);}}
                onLogout={() => {handleLogout(); setIsProfileDropDownVisible(false);}}
            />

            }
            <div className="main-content">
                <div className="page-header"><h2>{selectedTab}</h2></div>
                {/* Populate events or groups depending what tab was clicked on the side */}
                {newDisplay()}
            </div>
            
        </div>
    )
}

export default MainPage;