import InteractiveStatusIcon from "./InteractiveStatusIcon";
import "../styles/Tile.css";

const MemberTile = ({ username, status, isGroup }) => {
    return (
        <div className="tile">
            <p className="username">{username}</p>
            <InteractiveStatusIcon isGroup={isGroup} isWithinModal={true} username={username} status={status}/>
        </div>
    )
}

export default MemberTile;