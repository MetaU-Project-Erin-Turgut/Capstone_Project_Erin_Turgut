import { FaUserCircle } from "react-icons/fa";
import "../styles/UserResultCard.css";

const UserResultCard = () => {
    return (
        <div className="user-card">
            {/* temporary placement for user profile picture */}
            <FaUserCircle className="user-img"/> 
            <p>Username</p>            
        </div>
    )
}

export default UserResultCard;