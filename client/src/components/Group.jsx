import { useState } from 'react';
import GroupDetailsModal from './GroupDetailsModal';
import CompatibilityDisplay from './CompatibilityDisplay';
import StatusIcon from './StatusIcon';
import { Status } from "../utils/utils";
import "../styles/Card.css";


const Group = ( {groupData, updateGroup}) => {
    const [isGroupDetailsModalVisible, setIsGroupDetailsModalVisible] = useState(false);
    const compatibilityRatio = groupData.compatibilityRatio;
    const { title, description } = groupData.group; 

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
                <StatusIcon status={groupData.status}/>
                <h4 className="title">{title}</h4>
            </section>
            <p>{description}</p>
            {(groupData.status === Status.PENDING) && <CompatibilityDisplay compatibilityRatio={compatibilityRatio}/>}
        </div>
        {isGroupDetailsModalVisible && <GroupDetailsModal onModalClose={closeModal} groupData={groupData} onStatusChange={(newGroupObj, isGroupDeleted, groupId) => {updateGroup(newGroupObj, isGroupDeleted, groupId)}}/>}
        </>
    )
}

export default Group;