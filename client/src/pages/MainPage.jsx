import { useState, useMemo, useEffect } from 'react';
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import EventsList from './EventsList';
import GroupsList from './GroupsList';
import InterestList from './InterestList';
import APIUtils from '../utils/APIUtils';
import { Tab } from "../utils/utils";

const MainPage = () => {

    const [userEventTypeTallies, setUserEventTypeTallies] = useState([]);
    const [selectedTab, setSelectedTab] = useState(Tab.EVENTS);

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

    return (
        <div id="main-page">
            <NavBar/>
            <div className="main-content">
                <SideBar handleTabSelect={(tabName) => {
                    setSelectedTab(tabName);
                }}/>
                {/* Populate events or groups depending what tab was clicked on the side */}
                {newDisplay()}
            </div>
            
        </div>
    )
}

export default MainPage;