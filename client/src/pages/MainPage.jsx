import { useState, useEffect, useRef } from 'react';
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import EventsList from './EventsList';
import GroupsList from './GroupsList';
import { Tab } from "../utils/utils";
import { apifetchEvents }from '../utils/APIUtils';
import "../styles/MainPage.css";

const MainPage = () => {

    const defaultEvents = useRef([]);

    const [selectedTab, setSelectedTab] = useState(Tab.EVENTS);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const apiResultData = await apifetchEvents();
            setEvents(apiResultData.events);
            defaultEvents.current = apiResultData.events;
        } catch (error) {
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
    }

    const filterEventsByStatus = (status) => {
        const newEvents = defaultEvents.current.filter(event => 
            event.status === status
        );
        setEvents(newEvents);
    }

    return (
        <div id="main-page">
            <NavBar />
            <SideBar handleTabSelect={(tabName) => {
                setSelectedTab(tabName);
            }}/>
            {/* Populate events or groups depending what tab was clicked on the side */}
            {/* As you add more tabs, change to switch statement! */}
            {selectedTab == Tab.EVENTS? 
                <EventsList eventsArr={events} onFilterChange={filterEventsByStatus} refetchData={() => {fetchEvents()}}/> : <GroupsList />
            }
            
        </div>
    )
}

export default MainPage;