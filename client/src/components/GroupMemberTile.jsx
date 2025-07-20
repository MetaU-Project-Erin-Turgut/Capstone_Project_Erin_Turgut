import StatusIcon from "./StatusIcon";
import "../styles/GroupMemberTile.css";

const GroupMemberTile = ({ username, status }) => {
    return (
        <div className="group-member-tile">
            <p className="username">{username}</p>
            <StatusIcon status={status}/>
        </div>
    )
}

export default GroupMemberTile;