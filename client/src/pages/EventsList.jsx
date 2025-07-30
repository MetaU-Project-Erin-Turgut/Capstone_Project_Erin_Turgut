import { useState, useEffect, useMemo } from 'react';
import { Status } from "../utils/utils";
import { useNotification } from '../contexts/NotificationContext';
import List from '../components/List';
import APIUtils from '../utils/APIUtils';

const EventsList = ({ userTopEventType }) => {

    const { setMessage } = useNotification(); //used to control notification pop up and message
    
    const [events, setEvents] = useState(new Map());
    const [statusFilter, setStatusFilter] = useState(Status.NONE);
    const displayedEvents = useMemo(
        () => {
            if (statusFilter === Status.NONE) return events;
            const filteredEvents = Array.from(events.entries()).filter(([key, value])  => 
                value.status === statusFilter
            )
            return new Map(filteredEvents);
        },
        [events, statusFilter]
    );

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const apiResultData = await APIUtils.fetchEvents();
            const mappedEvents = new Map(
                apiResultData.events.map(event => [event.eventId, event])
            );
            setEvents(mappedEvents);
        } catch (error) {
            setMessage(error.message)
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
    }

    const updateEvents = (newEventObj) => {
        const updatedEvents = new Map(events);
        updatedEvents.set(newEventObj.eventId, newEventObj);
        setEvents(updatedEvents);
    }

    return <List 
        onNewFilter={(status) => {setStatusFilter(status)}}
        displayedItems={displayedEvents}
        isGroups={false}
        userTopEventType={userTopEventType}
        onUpdateItems={updateEvents}
    />
}

export default EventsList;