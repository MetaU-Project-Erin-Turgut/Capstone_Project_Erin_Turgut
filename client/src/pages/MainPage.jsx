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
            {selectedTab == Tab.EVENTS? 
                <EventsList /> : <GroupsList />
            }
        </div>
    )
}

export default MainPage;