import Card from "./Card";
import { CardFields, ModalFields } from "../utils/utils"
import APIUtils from '../utils/APIUtils';
import "../styles/Card.css";

const Event = ( {eventData, onUpdateEvent, isTopEventType}) => {

    const { id } = eventData.event;

    const updateEvent = async(statusState) => {
        //put request to change status of event
        try {
            const apiResultData = await APIUtils.updateEventStatus(id, statusState);
            onUpdateEvent({...eventData, status: apiResultData.status});
        } catch (error) {
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
    }
    
    return (
        <Card 
            cardData={eventData.event} 
            status={eventData.status} 
            isGroup={false}
            isTopEventType={isTopEventType}
            fields={new Set([CardFields.TITLE, CardFields.DESCRIPTION, CardFields.DATEANDTIME, CardFields.STATUS])}
            modalFields={new Set([ModalFields.TITLE, ModalFields.DESCRIPTION, ModalFields.INTEREST, ModalFields.ATTENDEES])}  
            onUpdate={updateEvent}
        />
    )
}

export default Event;