import { useState } from 'react';
import EventDetailsModal from './EventDetailsModal';
import StatusIcon from './StatusIcon';
import "../styles/Card.css";

const Event = ( {eventData, updateEvent}) => {

    const [isEventDetailsModalVisible, setIsEventDetailsModalVisible] = useState(false);

    const { title, description, dateTime } = eventData.event; //due to nature of prisma relational queries, event table data is in nested event property

    const eventDateTime = (new Date(dateTime)).toDateString();

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
                <StatusIcon status={eventData.status}/>
                <h4 className="title">{title}</h4>
            </section>
            <p>{description}</p>
            <p>{eventDateTime}</p> 
        </div>
        {isEventDetailsModalVisible && <EventDetailsModal onModalClose={closeModal} eventData={eventData} onStatusChange={(newEventObj) => {updateEvent(newEventObj)}}/>}
        </>
    )
}

export default Event;