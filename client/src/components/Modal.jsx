import { Suspense } from 'react';
import { ModalFields, Status } from "../utils/utils";
import StatusForm from './StatusForm';
import SingularSelectedInterest from './SingularSelectedInterest';
import MemberTile from './MemberTile';
import EventTypePreferenceDisplay from './EventTypePreferenceDisplay';
import "../styles/Modal.css";

//general Modal component used by Group.jsx and Event.jsx
const Modal = ({ onModalClose, cardData, onStatusUpdate, fields, status, isGroup }) => {

    return (
    <div className="overlay">
        <div className="modal-popup">
            <div className="modal-content">
                <button className="close-btn" onClick={onModalClose}>X</button>
                <section className='intro'>
                    {fields.has(ModalFields.TITLE) && <h1 className='title'>{cardData.title}</h1>}
                    {fields.has(ModalFields.DESCRIPTION) && <p className='description'>{cardData.description}</p>}
                </section>

                {fields.has(ModalFields.INTERESTS) &&
                    <>
                        <h2>Interests:</h2>
                        <section className='interests'>
                            <Suspense fallback={<p>Loading Interests...</p>}>
                                {cardData.interests.map((interest) => (
                                    <SingularSelectedInterest key={interest.interest.id} interest={interest.interest.title} />
                                ))}
                            </Suspense>
                        </section>
                    </>
                }

                {fields.has(ModalFields.EVENT_PREFERENCES) &&
                    <>
                        <h2>Member Event Type Preferences:</h2>
                        <EventTypePreferenceDisplay eventTypeTotals={cardData.eventTypeTotals}/>
                    </>
                }

                {fields.has(ModalFields.INTEREST) &&
                    <>
                        <h4>Core Interest:</h4>
                        <SingularSelectedInterest interest={cardData.interest.title} />
                    </>
                }

                {fields.has(ModalFields.PEOPLE) &&
                    <>
                        <h2>People:</h2>
                        <section className='people'>
                            <Suspense fallback={<p>Loading Members...</p>}>
                                {cardData.members.map((member) => (
                                    <MemberTile key={member.user.id} username={member.user.username} status={member.status} isGroup={isGroup} />
                                ))}
                            </Suspense>
                        </section>
                    </>
                }

                {fields.has(ModalFields.ATTENDEES) &&
                    <>
                        <h4>Attendees:</h4>
                        <section className='people'>
                            <Suspense fallback={<p>Loading Attendees...</p>}>
                                {cardData.attendees.map((attendee) => (
                                    <MemberTile key={attendee.user.id} username={attendee.user.username} status={attendee.status} isGroup={isGroup} />
                                ))}
                            </Suspense>
                        </section>
                    
                    </>

                }

                {(status !== Status.DROPPED && status !== Status.REJECTED) && 
                <>
                    <h2>Respond:</h2>
                    <StatusForm 
                        onSubmitChange={
                            async (selectedStatus) => {
                                await onStatusUpdate(selectedStatus); 
                                onModalClose();
                            }} 
                        currStatus={status} 
                    />
                </>}
            </div>
        </div>
    </div>)

}

export default Modal;