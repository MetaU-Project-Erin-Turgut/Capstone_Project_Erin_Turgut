import { Tab } from "../utils/utils";
import "../styles/SideBar.css"

const SideBar = ({ handleTabSelect }) => {

    return <nav className="sidebar"> 
        {
            Object.values(Tab).map((currentTab) => (
                <div key={currentTab} className="side-tab" onClick={() => {handleTabSelect(currentTab)}}>
                    <h3 className="title-text">{currentTab}</h3>
                </div>
            ))
        }
    </nav>
}

export default SideBar;