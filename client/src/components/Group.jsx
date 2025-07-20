import Card from "./Card";
import { CardFields, ModalFields, Status } from "../utils/utils";
import APIUtils from '../utils/APIUtils';
import "../styles/Card.css";


const Group = ( {groupData, onUpdateGroup}) => {
    const { id } = groupData.group;

    const updateGroup = async (statusState) => {
        //put request to change status of group
        try {
            const apiResultData = await APIUtils.updateGroupStatus(id, statusState);
            if (statusState === Status.DROPPED) {
                onUpdateGroup(apiResultData, apiResultData.isGroupDeleted, id);
            } else {
                onUpdateGroup(apiResultData, false, id) //no dropping occurred, so group can't have been deleted - pass false
            }
        } catch (error) {
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
    }
    
    return <Card 
        cardData={groupData.group} 
        compatibilityRatio={groupData.compatibilityRatio} 
        status={groupData.status} 
        fields={new Set([CardFields.TITLE, CardFields.DESCRIPTION, CardFields.COMPATIBILITY, CardFields.STATUS])} 
        modalFields={new Set([ModalFields.TITLE, ModalFields.DESCRIPTION, ModalFields.INTERESTS, ModalFields.PEOPLE])} 
        onUpdate={updateGroup}
    />
}

export default Group;