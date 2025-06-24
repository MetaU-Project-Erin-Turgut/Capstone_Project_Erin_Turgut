import { useNavigate } from  "react-router";
import { Tab } from "../utils/utils";
import "../styles/SideBar.css"

const SideBar = ({ handleTabSelect }) => {

    const navigate = useNavigate();

    return <nav className="sidebar"> 
        <div onClick={() => {
            handleTabSelect(Tab.EVENTS);
        }}>
            <h3 className="caprasimo-regular">Events</h3>
        </div>
        <div onClick={() => {
            handleTabSelect(Tab.GROUPS);
        }}>
            <h3 className="caprasimo-regular">Groups</h3>
        </div>
    </nav>
}

export default SideBar;