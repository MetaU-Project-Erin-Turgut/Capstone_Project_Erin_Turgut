import "../styles/Card.css";
import { LiaUserTimesSolid } from "react-icons/lia";//icon for "rejected event"
import { LiaUserCheckSolid } from "react-icons/lia";//icon for "accepted event"
import { LiaUserClockSolid } from "react-icons/lia";//icon for "pending response"

const Event = () => {
    return (
        <div className="card">
            <section className="card-header">
                {/* the below icon will be chnaged based on event status */}
                <LiaUserClockSolid className="status-icon"/>
                <h4 className="title">Title</h4>
            </section>
            <img src="https://picsum.photos/200/200" />
            <p>Location</p>
        </div>
    )
}

export default Event;