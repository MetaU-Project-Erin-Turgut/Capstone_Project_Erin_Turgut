// import { useUser } from "../contexts/UserContext";
import Event from "../components/Event";
import "../styles/CardListContainer.css"

const EventsList = ({ eventsArr }) => {

    // const { user } = useUser();

    return (
        <>
        {/* <h2>{user}</h2> */}
        <h2>Events</h2>
        <div className="card-container">
            {eventsArr?.map((event) => {
                return <Event 
                    key={event.event_id}
                    event_id={event.event_id}
                    status={event.status}
                    eventData={event}
                />
            })}
        </div>
        </>
    )
}

export default EventsList;