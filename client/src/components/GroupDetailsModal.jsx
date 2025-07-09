import { useState, Suspense } from 'react';
import { Status } from "../utils/utils";
import APIUtils from '../utils/APIUtils';

import "../styles/Modal.css";

const GroupDetailsModal = ( {onModalClose, groupData, onStatusChange}) => {
    
    const [statusState, setStatusState] = useState(groupData.status); 

    const { id, title, description, interests, members } = groupData.group;

    const handleDropdownChange = (event) => {
        setStatusState(event.target.value);
    }

    const handleStatusUpdate = async () => {
        //put request to change status of group
        try {
            const apiResultData = await APIUtils.updateGroupStatus(id, statusState);
            onStatusChange({...groupData, status: apiResultData.status});
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
                    <Suspense fallback={<p>Loading Interests...</p>}>
                        <h5>Interests:</h5>
                        {interests.map((interest) => (
                            <p key={interest.interest.id}>{interest.interest.title}</p> 
                        ))}
                    </Suspense>
                    <Suspense fallback={<p>Loading Members...</p>}>
                        <h5>Members:</h5>
                        {members.map((member) => (
                            <p key={member.user.id}>{member.user.username} {member.status}</p> 
                        ))}
                    </Suspense>
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

export default GroupDetailsModal;