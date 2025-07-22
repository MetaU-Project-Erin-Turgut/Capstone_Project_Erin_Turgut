import { useState, useEffect, useMemo } from 'react';
import { Suspense } from 'react';
import { Status } from "../utils/utils";
import Event from "../components/Event";
import FilterOptions from "../components/FilterOptions";
import APIUtils from '../utils/APIUtils';
import "../styles/CardListContainer.css"

const EventsList = () => {


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
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
    }

    return (
        <>
        <h2>Events</h2>
        <FilterOptions onFilterChange={(status) => {setStatusFilter(status)}}/>
        <div className="card-container">
            <Suspense fallback={<p>Loading...</p>}>
                {Array.from(displayedEvents.entries()).map(([key, value]) => (
                    <Event 
                        key={key}
                        eventData={value}
                        onUpdateEvent= {(newEventObj) => {
                            const updatedEvents = new Map(events);
                            updatedEvents.set(newEventObj.eventId, newEventObj);
                            setEvents(updatedEvents);
                        }}
                    />
                ))}
            </Suspense>
        </div>
        </>
    )
}

export default EventsList;