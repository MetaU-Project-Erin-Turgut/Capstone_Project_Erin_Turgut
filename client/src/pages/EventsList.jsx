import Event from "../components/Event";
import FilterOptions from "../components/FilterOptions";
import "../styles/CardListContainer.css"

const EventsList = ({ eventsArr, filterEvents }) => {

    return (
        <>
        <h2>Events</h2>
        <FilterOptions filterEvents={filterEvents}/>
        <div className="card-container">
            {eventsArr?.map((event) => {
                return <Event 
                    key={event.event_id}
                    eventData={event}
                />
            })}
        </div>
        </>
    )
}

export default EventsList;