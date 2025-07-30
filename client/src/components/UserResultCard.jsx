import { FaUserCircle } from "react-icons/fa";
import "../styles/UserResultCard.css";

const UserResultCard = ({username, numMutualGroups}) => {
    let isMultiple = (numMutualGroups === 1 ? false : true) //done to avoid it saying "1 groups"
    return (
        <div className="user-card">
            {/* temporary placement for user profile picture */}
            <FaUserCircle className="user-img"/> 
            <p>{username}</p>
            {numMutualGroups && <p>You guys are in {numMutualGroups} {isMultiple ? "groups" : "group"} together</p>}            
        </div>
    )
}

export default UserResultCard;