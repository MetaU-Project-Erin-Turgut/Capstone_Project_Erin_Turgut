import { useState } from 'react';
import { Status } from "../utils/utils";
import APIUtils from '../utils/APIUtils';

import "../styles/Modal.css";

const EventDetailsModal = ( {onModalClose, eventData, onStatusChange}) => {
    
    const [statusState, setStatusState] = useState(eventData.status); 

    const { id, address, description, title, zip_code } = eventData.event;

    const handleDropdownChange = (event) => {
        setStatusState(event.target.value);
    }

    const handleStatusUpdate = async () => {
        //put request to change status of event
        try {
            const apiResultData = await APIUtils.updateEventStatus(id, statusState);
            onStatusChange({...eventData, status: apiResultData.status});
            onModalClose();
        } catch (error) {
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
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