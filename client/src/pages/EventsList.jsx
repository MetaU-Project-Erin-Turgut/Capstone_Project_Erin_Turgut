import Event from "../components/Event";
import "../styles/CardListContainer.css"

const EventsList = () => {
    return (
        <>
        <h2>Events</h2>
        <div className="card-container">
            {/* Events will be dynamically loaded here! */}
            <Event />
            <Event />
            <Event />
        </div>
        </>
    )
}

export default EventsList;