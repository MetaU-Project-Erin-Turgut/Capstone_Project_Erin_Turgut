import { useState } from 'react';
import { LiaUserTimesSolid as RejectedIcon} from "react-icons/lia";//icon for "rejected event"
import { LiaUserCheckSolid as AcceptedIcon} from "react-icons/lia";//icon for "accepted event"
import { LiaUserClockSolid as PendingIcon} from "react-icons/lia";//icon for "pending response"
import GroupDetailsModal from './GroupDetailsModal';
import { Status } from "../utils/utils";
import "../styles/Card.css";


const Group = ( {groupData, updateGroup}) => {
    const [isGroupDetailsModalVisible, setIsGroupDetailsModalVisible] = useState(false);
    const compatibilityRatio = groupData.compatibilityRatio;
    const { title, description } = groupData.group; 

    const renderStatus = () => {
        switch(groupData.status) {
            case Status.ACCEPTED: 
                return <AcceptedIcon className="status-icon"/>
            case Status.PENDING: 
                return <PendingIcon className="status-icon"/>
            case Status.REJECTED:
                return <RejectedIcon className="status-icon"/>
        }
    }

    const openModal = () => {
        setIsGroupDetailsModalVisible(true)
    }
    const closeModal = () => {
        setIsGroupDetailsModalVisible(false);
    }
    
    return (
        <>
        <div className="card" onClick={openModal}>
            <section className="card-header">
                {renderStatus()}
                <h4 className="title">{title}</h4>
            </section>
            <p>{description}</p>
            <h5>Compatibility Ratio: </h5>
            <p>{compatibilityRatio * 100}%</p>
        </div>
        {isGroupDetailsModalVisible && <GroupDetailsModal onModalClose={closeModal} groupData={groupData} onStatusChange={(newGroupObj) => {updateGroup(newGroupObj)}}/>}
        </>
    )
}

export default Group;