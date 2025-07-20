import { useState } from 'react';
import { Status } from "../utils/utils";
import StatusIcon from "./StatusIcon";
import ToolTip from "./ToolTip";

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
            setMessage(`You have${statusMessage}${inviteType}. Click on the ${inviteType} and scroll down to change your status!`);
        }

        setIsHoveredOver(true)
    }

    const onNoHover = () => {
        setIsHoveredOver(false)
    }
    
    return (
        <div onMouseEnter={onHover} onMouseLeave={onNoHover}>
            <StatusIcon status={status}/>
            {isHoveredOver && <ToolTip message={message}/>}
        </div>
    )
}

export default InteractiveStatusIcon;