import Card from "./Card";
import { CardFields, ModalFields } from "../utils/utils"
import { useLoader } from "../contexts/LoadingContext";
import APIUtils from '../utils/APIUtils';
import "../styles/Card.css";

const Event = ( {eventData, onUpdateEvent}) => {
    const { id } = eventData.event;

    const { setIsLoading } = useLoader(); //used to control loading screen during api call

    const updateEvent = async(statusState) => {
        //put request to change status of event
        setIsLoading(true);
        try {
            const apiResultData = await APIUtils.updateEventStatus(id, statusState);
            onUpdateEvent({...eventData, status: apiResultData.status});
        } catch (error) {
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
        setIsLoading(false);
    }
    
    return (
        <Card 
            cardData={eventData.event} 
            status={eventData.status} 
            isGroup={false}
            fields={new Set([CardFields.TITLE, CardFields.DESCRIPTION, CardFields.DATEANDTIME, CardFields.STATUS])}
            modalFields={new Set([ModalFields.TITLE, ModalFields.DESCRIPTION, ModalFields.INTEREST, ModalFields.ATTENDEES])}  
            onUpdate={updateEvent}
        />
    )
}

export default Event;