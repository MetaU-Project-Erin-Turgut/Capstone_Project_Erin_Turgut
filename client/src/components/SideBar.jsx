import { Tab } from "../utils/utils";
import SideBarIcon from "./SideBarIcon";
import "../styles/DropDownBar.css";

const SideBar = ({ handleTabSelect }) => {

    return (
        <nav className="dropdown-bar"> 
            {
                Object.values(Tab).map((currentTab) => (
                    <div key={currentTab} className="bar-tab" onClick={() => {handleTabSelect(currentTab);}}>
                        <SideBarIcon tab={currentTab}/>
                        <p className="title-text">{currentTab}</p>
                    </div>
                ))
            }
        </nav>
    )
}

export default SideBar;