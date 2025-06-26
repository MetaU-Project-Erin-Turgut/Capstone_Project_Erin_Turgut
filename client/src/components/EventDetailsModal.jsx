import { Status } from "../utils/utils";
import { useUser } from "../contexts/UserContext";
import "../styles/Modal.css";

const EventDetailsModal = ( {closeModal, eventData, currStatus, updateStatus}) => {

    const { user } = useUser();

    const { event_id } = eventData;
    const { address, description, title, zip_code } = eventData.event; //needs to be done this way due to nature of database query many-to-many

    const handleStatusUpdate = async (event) => {
        //put request to change status of event
        try {
            const response = await fetch(`http://localhost:3000/user/events/${event_id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "user_id": user.id,
                    "updatedStatus": event.target.value
                }),
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                updateStatus(event.target.value);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error("Network error:", error);
        }

    }

    return (
        <div className="modal-overlay"> 
            <div className="modal-popup">       
                <div className="modal-content">
                    <button className="close-btn" onClick={closeModal}>X</button>
                    <h4>{title}</h4>
                    <p>{description}</p>
                    <p>{address}</p>
                    <p>{zip_code}</p>
                    <div className="select-form">
                        <select name="update-sattus" defaultValue={currStatus} onChange={handleStatusUpdate}>
                            <option disabled value="">Choose status</option>
                            <option value={Status.PENDING}>{Status.PENDING}</option>
                            <option value={Status.ACCEPTED}>{Status.ACCEPTED}</option>
                            <option value={Status.REJECTED}>{Status.REJECTED}</option>
                        </select>
                    </div>

                </div>
            </div>
        </div>
    )

}

export default EventDetailsModal;