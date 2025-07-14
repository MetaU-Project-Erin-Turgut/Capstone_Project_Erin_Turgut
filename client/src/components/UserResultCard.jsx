import { FaUserCircle } from "react-icons/fa";
import "../styles/UserResultCard.css";

const UserResultCard = ({username}) => {
    return (
        <div className="user-card">
            {/* temporary placement for user profile picture */}
            <FaUserCircle className="user-img"/> 
            <p>{username}</p>            
        </div>
    )
}

export default UserResultCard;