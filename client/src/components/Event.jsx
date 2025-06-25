import "../styles/Card.css";
import { LiaUserTimesSolid } from "react-icons/lia";//icon for "rejected event"
import { LiaUserCheckSolid } from "react-icons/lia";//icon for "accepted event"
import { LiaUserClockSolid } from "react-icons/lia";//icon for "pending response"


const Event = ( {event_id, status, eventData}) => {
    
    const { title, description, zip_code, address  } = eventData.event; //due to nature of prisma relational queries, event table data is in nested event propert
    return (
        <div className="card" onClick={() => {
        }}>
            <section className="card-header">
                {/* the below icon will be chnaged based on event status */}
                <LiaUserClockSolid className="status-icon"/>
                <h4 className="title">{title}</h4>
            </section>
            {/* <img src="https://picsum.photos/200/200" /> */}
            <p>{description}</p>
            <p>{zip_code}</p>
        </div>
    )
}

export default Event;