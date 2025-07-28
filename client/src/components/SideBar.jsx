import { Tab } from "../utils/utils";
import SideBarIcon from "./SideBarIcon";
import "../styles/SideBar.css"

const SideBar = ({ handleTabSelect }) => {

    return (
        <nav className="sidebar"> 
            {
                Object.values(Tab).map((currentTab) => (
                    <div key={currentTab} className="side-tab" onClick={() => {handleTabSelect(currentTab);}}>
                        <SideBarIcon tab={currentTab}/>
                        <p className="title-text">{currentTab}</p>
                    </div>
                ))
            }
        </nav>
    )
}

export default SideBar;