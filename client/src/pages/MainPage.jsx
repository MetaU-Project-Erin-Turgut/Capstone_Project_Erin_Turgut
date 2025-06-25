import { useState, useEffect } from 'react';
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import EventsList from './EventsList';
import GroupsList from './GroupsList';
import { Tab } from "../utils/utils";
import "../styles/MainPage.css";

const MainPage = () => {

    const [selectedTab, setSelectedTab] = useState(Tab.EVENTS);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch("http://localhost:3000/user/events/", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data[0].events);
                setEvents(data[0].events);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    }

    return (
        <div id="main-page">
            <NavBar />
            <SideBar handleTabSelect={(tabName) => {
                setSelectedTab(tabName);
            }}/>
            {/* Populate events or groups depending what tab was clicked on the side */}
            {selectedTab == Tab.EVENTS? 
                <EventsList eventsArr={events}/> : <GroupsList />
            }
            
        </div>
    )
}

export default MainPage;