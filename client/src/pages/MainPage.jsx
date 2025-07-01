import { useState } from 'react';
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import EventsList from './EventsList';
import GroupsList from './GroupsList';
import { Tab } from "../utils/utils";
import "../styles/MainPage.css";

const MainPage = () => {

    const [selectedTab, setSelectedTab] = useState(Tab.EVENTS);

    return (
        <div id="main-page">
            <NavBar />
            <SideBar handleTabSelect={(tabName) => {
                setSelectedTab(tabName);
            }}/>
            {/* Populate events or groups depending what tab was clicked on the side */}
            {/* As you add more tabs, change to switch statement! */}
            {selectedTab == Tab.EVENTS? 
                <EventsList/> : <GroupsList />
            }
            
        </div>
    )
}

export default MainPage;