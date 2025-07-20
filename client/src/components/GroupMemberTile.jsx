import InteractiveStatusIcon from "./InteractiveStatusIcon";
import "../styles/Tile.css";

const GroupMemberTile = ({ username, status }) => {
    return (
        <div className="tile">
            <p className="username">{username}</p>
            <InteractiveStatusIcon isGroup={true} isWithinModal={true} username={username} status={status}/>
        </div>
    )
}

export default GroupMemberTile;