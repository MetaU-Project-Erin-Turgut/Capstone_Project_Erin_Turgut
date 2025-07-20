import { useState } from 'react';
import { Status } from "../utils/utils";
import StatusIcon from "./StatusIcon";
import ToolTip from "./ToolTip";
import "../styles/InteractiveStatusIcon.css"

const InteractiveStatusIcon = ({ status, isGroup, isWithinModal, username }) => {
    const [isHoveredOver, setIsHoveredOver] = useState(false);
    const [message, setMessage] = useState("");

    const onHover = () => {
        const inviteType = isGroup? "group" : "event";

        let statusMessage = "";
        switch (status) {
            case Status.ACCEPTED:
                statusMessage = " accepted this ";
                break;
            case Status.PENDING:
                statusMessage = " yet to respond to this ";
                break;
            case Status.REJECTED:
                statusMessage = " rejected this ";
                break;
            case Status.DROPPED:
                statusMessage = " dropped this ";
        }

        if (isWithinModal) { //means it pertains to other users
            setMessage(`${username} has${statusMessage}${inviteType}`);
        } else { //that means it's on a group or event card so it pertains to the user
            if (status === Status.DROPPED) {
                setMessage(`You have${statusMessage}${inviteType}.`) //for now, we will make it so that user cannot rejoin group/event when droped 
            } else {
                setMessage(`You have${statusMessage}${inviteType}. Click on the ${inviteType} and scroll down to change your status!`);
            }
        }

        setIsHoveredOver(true)
    }

    const onNoHover = () => {
        setIsHoveredOver(false)
    }
    
    //set a small delay for on hover and on hover away. also, depending on whether the notification is within a modal or not, modify the distance between the icon and the tooltip
    return (
        <div className="interactive-status-container" onMouseEnter={() => {setTimeout(onHover, 300)}} onMouseLeave={() => {setTimeout(onNoHover, 200)}}>
            <StatusIcon status={status}/>
            {isHoveredOver && <ToolTip message={message} distanceFromIcon={isWithinModal? 20 : 130}/>}
        </div>
    )
}

export default InteractiveStatusIcon;