import { useState } from 'react';
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import EventsList from './EventsList';
import GroupsList from './GroupsList';
import InterestList from './InterestList';
import { Tab } from "../utils/utils";

const MainPage = () => {

    const [selectedTab, setSelectedTab] = useState(Tab.EVENTS);

    const newDisplay = () => {
        switch(selectedTab) {
            case Tab.EVENTS: 
                return <EventsList/>
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