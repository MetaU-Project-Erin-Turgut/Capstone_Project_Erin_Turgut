import { useState, useRef } from 'react';
import { Status } from "../utils/utils";
import '../styles/StatusForm.css';

const StatusForm = ({ onSubmitChange, currStatus }) => {
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    let selectedStatus = useRef(currStatus);

    const changeSelectedState = (newStatus) => {
        selectedStatus.current = newStatus;
        setIsSubmitDisabled(false);
    }

    const handleSubmit = () => {
        if (selectedStatus.current === currStatus) {
            setIsSubmitDisabled(true);
        } else {
            onSubmitChange(selectedStatus.current);
        }
        
    }

    //need to change button options depending on whether the group has already been accepted or not
    return (
        <section className="change-status-form">
            {currStatus === Status.PENDING?<p>You haven't responded to this invite yet.</p> : <p>Click "Drop" if you would like to drop this group.</p> }
            {currStatus === Status.PENDING&&<button onClick={() => changeSelectedState(Status.ACCEPTED)}>Accept</button>}
            {currStatus === Status.PENDING?<button onClick={() => changeSelectedState(Status.REJECTED)}>Ignore</button>:<button onClick={() => changeSelectedState(Status.DROPPED)}>Drop</button>}
            <button onClick={() => handleSubmit()} disabled={isSubmitDisabled}>Submit Changes</button>
        </section>
        
    )
}

export default StatusForm;