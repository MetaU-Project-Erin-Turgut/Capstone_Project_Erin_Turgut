import { useState } from 'react';
import { LiaUserTimesSolid as RejectedIcon} from "react-icons/lia";//icon for "rejected event"
import { LiaUserCheckSolid as AcceptedIcon} from "react-icons/lia";//icon for "accepted event"
import { LiaUserClockSolid as PendingIcon} from "react-icons/lia";//icon for "pending response"
import EventDetailsModal from './EventDetailsModal';
import { Status } from "../utils/utils";
import "../styles/Card.css";


const Event = ( {eventData, updateEvent}) => {

    const [isEventDetailsModalVisible, setIsEventDetailsModalVisible] = useState(false);

    const { title, description, zip_code, address  } = eventData.event; //due to nature of prisma relational queries, event table data is in nested event property

    const renderStatus = () => {
        switch(eventData.status) {
            case Status.ACCEPTED: 
                return <AcceptedIcon className="status-icon"/>
            case Status.PENDING: 
                return <PendingIcon className="status-icon"/>
            case Status.REJECTED:
                return <RejectedIcon className="status-icon"/>
        }
    }

    const openModal = () => {
        setIsEventDetailsModalVisible(true)
    }
    const closeModal = () => {
        setIsEventDetailsModalVisible(false);
    }
    
    return (
        <>
        <div className="card" onClick={openModal}>
            <section className="card-header">
                {renderStatus()}
                <h4 className="title">{title}</h4>
            </section>
            <p>{description}</p>
            <p>{zip_code}</p>
        </div>
        {isEventDetailsModalVisible && <EventDetailsModal onModalClose={closeModal} eventData={eventData} onStatusChange={(newEventObj) => {updateEvent(newEventObj)}}/>}
        </>
    )
}

export default Event;