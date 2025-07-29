import { useState } from 'react';
import { Status, CardFields } from "../utils/utils"
import Modal from "./Modal";
import CompatibilityDisplay from "./CompatibilityDisplay";
import InteractiveStatusIcon from './InteractiveStatusIcon';
import "../styles/Card.css"

//general Card component used by Group.jsx and Event.jsx
const Card = ({fields, cardData, compatibilityRatio, status, onUpdate, modalFields, isGroup, isTopEventType}) => {

    const [isModalVisible, setIsModalVisible] = useState(false);

    const openModal = () => {
        setIsModalVisible(true)
    }
    const closeModal = () => {
        setIsModalVisible(false);
    }

    return (<>
        <div className="card" onClick={openModal}>
            {(!isGroup && status !== Status.ACCEPTED && isTopEventType) && <div className="event-suggestion">We think you'll like this event!</div>}
            <section className="card-header">
                {fields.has(CardFields.STATUS) && <InteractiveStatusIcon isGroup={isGroup} isWithinModal={false} status={status}/>}
                {fields.has(CardFields.TITLE) && <h4 className="title">{cardData.title}</h4>}
            </section>
            {fields.has(CardFields.DESCRIPTION) && <p>{cardData.description}</p>}
            {fields.has(CardFields.DATEANDTIME) && <p>{(new Date(cardData.dateTime)).toDateString()}</p>}
            {(fields.has(CardFields.COMPATIBILITY) && status === Status.PENDING) && <CompatibilityDisplay compatibilityRatio={compatibilityRatio}/>}
        </div>
        {isModalVisible && <Modal onModalClose={closeModal} isGroup={isGroup} status={status} cardData={cardData} fields={modalFields} onStatusUpdate={onUpdate}/>}
    </>)
}

export default Card;