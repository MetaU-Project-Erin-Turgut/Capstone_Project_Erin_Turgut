import { Status } from "../utils/utils";
import { LiaUserTimesSolid as RejectedIcon} from "react-icons/lia";//icon for "rejected/ignored"
import { LiaUserCheckSolid as AcceptedIcon} from "react-icons/lia";//icon for "accepted"
import { LiaUserClockSolid as PendingIcon} from "react-icons/lia";//icon for "pending"
import { FaRunning as DroppedIcon} from "react-icons/fa"; //icon for "dropped"
import "../styles/StatusIcon.css"

const StatusIcon = ({ status }) => {

    switch (status) {
        case Status.ACCEPTED:
            return <AcceptedIcon className="status-icon" />
        case Status.PENDING:
            return <PendingIcon className="status-icon" />
        case Status.REJECTED:
            return <RejectedIcon className="status-icon" />
        case Status.DROPPED:
            return <DroppedIcon className="status-icon" />

    }
}

export default StatusIcon