import { useState } from 'react';
import { Status } from "../utils/utils";
import '../styles/StatusForm.css';

const StatusForm = ({ onSubmitChange, currStatus }) => {
    const [notif, setNotif] = useState(''); //notification to user if they make an invalid action - in this case pressing submit without changing status
    let selectedStatus = currStatus;

    const changeSelectedState = (newStatus) => {
        selectedStatus = newStatus;
        setNotif('');
    }

    const handleSubmit = () => {
        if (selectedStatus === currStatus) {
            setNotif("You haven't selected anything");
        } else {
            onSubmitChange(selectedStatus);
        }
        
    }

    //need to change button options depending on whether the group has already been accepted or not
    return (
        <section className="change-status-form">
            {currStatus === Status.PENDING?<p>You haven't responded to this invite yet.</p> : <p>Click "Drop" if you would like to drop this group.</p> }
            {currStatus === Status.PENDING&&<button onClick={() => changeSelectedState(Status.ACCEPTED)}>Accept</button>}
            <button onClick={() => changeSelectedState(Status.REJECTED)}>{currStatus === Status.PENDING? "Ignore": "Drop" }</button>
            <p>{notif}</p>
            <button onClick={() => handleSubmit()}>Submit Changes</button>
        </section>
        
    )
}

export default StatusForm;