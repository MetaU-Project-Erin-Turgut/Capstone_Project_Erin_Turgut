import { useState } from 'react';
import { Status } from "../utils/utils";
import "../styles/Modal.css";

const EventDetailsModal = ( {onModalClose, eventData, initialStatus, onStatusChange}) => {

    const [statusState, setStatusState] = useState(initialStatus); 

    const { id, address, description, title, zip_code } = eventData;

    const handleDropdownChange = (event) => {
        setStatusState(event.target.value);
    }

    const handleStatusUpdate = async () => {
        //put request to change status of event
        try {
            const response = await fetch(`http://localhost:3000/user/events/${id}`, { //path param is event id
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "updatedStatus": statusState
                }),
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                await onStatusChange(statusState);
                onModalClose();
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
                    <button className="close-btn" onClick={onModalClose}>X</button>
                    <h4>{title}</h4>
                    <p>{description}</p>
                    <p>{address}</p>
                    <p>{zip_code}</p>
                    <div className="select-form">
                        <select name="update-sattus" defaultValue={statusState} onChange={handleDropdownChange}>
                            <option disabled value="">Choose status</option>
                            <option value={Status.PENDING}>{Status.PENDING}</option>
                            <option value={Status.ACCEPTED}>{Status.ACCEPTED}</option>
                            <option value={Status.REJECTED}>{Status.REJECTED}</option>
                        </select>
                        <button onClick={handleStatusUpdate}>Submit Changes</button>
                    </div>

                </div>
            </div>
        </div>
    )

}

export default EventDetailsModal;