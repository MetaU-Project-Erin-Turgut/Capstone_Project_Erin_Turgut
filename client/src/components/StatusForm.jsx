import { useState } from 'react';
import { Status } from "../utils/utils";
import "../styles/StatusForm.css";

const StatusForm = ({ onSubmitChange, currStatus }) => {
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState(Status.NONE);


    const changeSelectedState = (newStatus) => {
        setSelectedStatus(newStatus);
        setIsSubmitDisabled(false);
    }

    const handleSubmit = () => {
        if (selectedStatus === currStatus) {
            setIsSubmitDisabled(true);
        } else {
            onSubmitChange(selectedStatus);
        }
        
    }

    //need to change button options depending on whether the group has already been accepted or not
    return (
        <section className="change-status-form">
            {currStatus === Status.PENDING ? 
                <>
                    <p className='notif'>You haven't responded to this invite yet.</p> 
                    <button className={selectedStatus === Status.ACCEPTED ? "btn-clicked" : "btn"} onClick={() => changeSelectedState(Status.ACCEPTED)}>Accept</button> 
                    <button className={selectedStatus === Status.REJECTED ? "btn-clicked" : "btn"} onClick={() => changeSelectedState(Status.REJECTED)}>Ignore</button>
                </>
                : 
                <>
                    <p className='notif'>Click "Drop" if you would like to drop this group.</p> 
                    <button className={selectedStatus === Status.DROPPED ? "btn-clicked" : "btn"} onClick={() => changeSelectedState(Status.DROPPED)}>Drop</button>
                </>
            }
            <button className={isSubmitDisabled ? "btn-disabled" : "btn"} onClick={handleSubmit} disabled={isSubmitDisabled}>Submit Changes</button>  
        </section>
    )
}

export default StatusForm;