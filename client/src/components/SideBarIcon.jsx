import { MdEvent } from "react-icons/md";
import { MdGroups } from "react-icons/md";
import { MdOutlineInterests } from "react-icons/md";
import { Tab } from "../utils/utils";


const SideBarIcon = ( { tab }) => {
    switch (tab) {
        case Tab.EVENTS:
            return <MdEvent className="icon" />
        case Tab.GROUPS:
            return <MdGroups className="icon" />
        case Tab.INTERESTS:
            return <MdOutlineInterests className="icon" />

    }
}

export default SideBarIcon;