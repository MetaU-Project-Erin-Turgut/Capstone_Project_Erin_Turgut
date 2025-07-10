import { Suspense } from 'react';
import APIUtils from '../utils/APIUtils';
import StatusForm from './StatusForm';
import "../styles/Modal.css";

const EventDetailsModal = ( {onModalClose, eventData, onStatusChange}) => {
    
    const { id, title, description, interest, attendees } = eventData.event;

    const handleStatusUpdate = async (statusState) => {
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
                    <h4>Core Interest:</h4>
                    <p>{interest.title}</p>
                    <Suspense fallback={<p>Loading Attendees...</p>}>
                        <h4>Attendees:</h4>
                        {attendees.map((attendee) => (
                            <p key={attendee.user.id}>{attendee.user.username} {attendee.status} </p> 
                        ))}
                    </Suspense>
                    <StatusForm onSubmitChange={handleStatusUpdate} currStatus={eventData.status}/>
                </div>
            </div>
        </div>
    )

}

export default EventDetailsModal;