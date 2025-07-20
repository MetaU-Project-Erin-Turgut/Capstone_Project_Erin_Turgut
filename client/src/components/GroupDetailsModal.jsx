import { Suspense } from 'react';
import { Status } from "../utils/utils";
import APIUtils from '../utils/APIUtils';
import StatusForm from './StatusForm';
import SingularSelectedInterest from './SingularSelectedInterest';
import GroupMemberTile from './GroupMemberTile';
import "../styles/Modal.css";

const GroupDetailsModal = ( {onModalClose, groupData, onStatusChange}) => {
    
    const { id, title, description, interests, members } = groupData.group;

    const handleStatusUpdate = async (statusState) => {
        //put request to change status of group
        try {
            const apiResultData = await APIUtils.updateGroupStatus(id, statusState);
            if (statusState === Status.DROPPED) {
                 onStatusChange(apiResultData, apiResultData.isGroupDeleted, id)
            } else {
                onStatusChange(apiResultData, false, id) //no dropping occurred, so group can't have been deleted - pass false
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
                    <section className='intro'>
                        <h1 className='title'>{title}</h1>
                        <p className='description'>{description}</p>
                    </section>

                    <h2>Interests:</h2>
                    <section className='interests'>
                        <Suspense fallback={<p>Loading Interests...</p>}>
                            {interests.map((interest) => (
                                <SingularSelectedInterest key={interest.interest.id} interest={interest.interest.title}/>
                            ))}
                        </Suspense>
                    </section>

                    <h2>People:</h2>
                    <section className='members'>
                        <Suspense fallback={<p>Loading Members...</p>}>
                            {members.map((member) => (
                                <GroupMemberTile key={member.user.id} username={member.user.username} status={member.status} />
                            ))}
                        </Suspense>
                    </section>

                    <h2>Respond:</h2>
                    {(groupData.status !== Status.DROPPED && groupData.status !== Status.REJECTED)&&<StatusForm onSubmitChange={handleStatusUpdate} currStatus={groupData.status}/>}
                </div>
            </div>
        </div>
    )

}

export default GroupDetailsModal;