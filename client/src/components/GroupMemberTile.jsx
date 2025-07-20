import StatusIcon from "./StatusIcon";
import "../styles/Tile.css";

const GroupMemberTile = ({ username, status }) => {
    return (
        <div className="tile">
            <p className="username">{username}</p>
            <StatusIcon status={status}/>
        </div>
    )
}

export default GroupMemberTile;