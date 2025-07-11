import { Suspense } from 'react';
import { Status } from "../utils/utils";
import APIUtils from '../utils/APIUtils';
import StatusForm from './StatusForm';
import "../styles/Modal.css";

const GroupDetailsModal = ( {onModalClose, groupData, onStatusChange}) => {
    
    const { id, title, description, interests, members } = groupData.group;

    const handleStatusUpdate = async (statusState) => {
        //put request to change status of group
        try {
            const apiResultData = await APIUtils.updateGroupStatus(id, statusState);
            onStatusChange({...groupData, status: apiResultData.status});
            if (statusState === Status.ACCEPTED) {
                const apiResultData = await APIUtils.acceptGroup(id);
                onStatusChange(apiResultData);
            } else {
                const apiResultData = await APIUtils.updateGroupStatus(id, statusState);
                onStatusChange({...groupData, status: apiResultData.status});
            } 
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
                    {/* show form with options accept group or ignore when pending OR show form with only drop group option */}
                    <StatusForm onSubmitChange={handleStatusUpdate} currStatus={groupData.status}/>
                </div>
            </div>
        </div>
    )

}

export default GroupDetailsModal;