import { Suspense } from 'react';
import Event from "../components/Event";
import FilterOptions from "../components/FilterOptions";
import "../styles/CardListContainer.css"

const EventsList = ({ eventsArr, onFilterChange, refetchData }) => {

    return (
        <>
        <h2>Events</h2>
        <FilterOptions onFilterChange={onFilterChange}/>
        <div className="card-container">
            <Suspense fallback={<p>Loading...</p>}>
                {eventsArr.map((event) => {
                    return <Event 
                        key={event.event_id}
                        eventData={event}
                        refetchData={refetchData}
                    />
                })}
            </Suspense>
        </div>
        </>
    )
}

export default EventsList;