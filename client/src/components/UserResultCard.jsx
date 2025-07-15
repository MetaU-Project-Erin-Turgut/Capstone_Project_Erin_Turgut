import { FaUserCircle } from "react-icons/fa";
import "../styles/UserResultCard.css";

const UserResultCard = ({username, numMutualGroups}) => {
    return (
        <div className="user-card">
            {/* temporary placement for user profile picture */}
            <FaUserCircle className="user-img"/> 
            <p>{username}</p>
            {numMutualGroups && <p>You guys are in {numMutualGroups} groups together</p>}            
        </div>
    )
}

export default UserResultCard;