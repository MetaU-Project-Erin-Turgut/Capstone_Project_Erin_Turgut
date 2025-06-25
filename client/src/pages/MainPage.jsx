import { useState } from 'react';
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import EventsList from './EventsList';
import GroupsList from './GroupsList';
import { Tab } from "../utils/utils";
import "../styles/MainPage.css";

const MainPage = () => {

    const [selectedTab, setSelectedTab] = useState(Tab.EVENTS);

    //will need to fetch data here based on user logged in 
    //then display each as state variable selectedTab changes

    return (
        <div id="main-page">
            <NavBar />
            <SideBar handleTabSelect={(tabName) => {
                setSelectedTab(tabName);
            }}/>
            {/* Populate events or groups depending what tab was clicked on the side */}
            {selectedTab == Tab.EVENTS? 
                <EventsList /> : <GroupsList />
            }
            
        </div>
    )
}

export default MainPage;