import { useState } from 'react';
import { LiaUserTimesSolid as RejectedIcon} from "react-icons/lia";//icon for "rejected/ignored"
import { LiaUserCheckSolid as AcceptedIcon} from "react-icons/lia";//icon for "accepted"
import { LiaUserClockSolid as PendingIcon} from "react-icons/lia";//icon for "pending"
import { FaRunning as DroppedIcon} from "react-icons/fa"; //icon for "dropped"
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
            case Status.DROPPED:
                return <DroppedIcon className="status-icon"/>

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
            {(groupData.status === Status.PENDING) &&
                <section className="compatibility-display">
                    <h5>Compatibility Ratio: </h5>
                    <p>{Math.round(compatibilityRatio * 100)}%</p>
                </section>
            }
        </div>
        {isGroupDetailsModalVisible && <GroupDetailsModal onModalClose={closeModal} groupData={groupData} onStatusChange={(newGroupObj, isGroupDeleted, groupId) => {updateGroup(newGroupObj, isGroupDeleted, groupId)}}/>}
        </>
    )
}

export default Group;