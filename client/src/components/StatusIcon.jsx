import { Status } from "../utils/utils";
import { LiaUserTimesSolid as RejectedIcon} from "react-icons/lia";//icon for "rejected/ignored"
import { LiaUserCheckSolid as AcceptedIcon} from "react-icons/lia";//icon for "accepted"
import { LiaUserClockSolid as PendingIcon} from "react-icons/lia";//icon for "pending"
import { FaRunning as DroppedIcon} from "react-icons/fa"; //icon for "dropped"

const StatusIcon = ({ status }) => {

    switch (status) {
        case Status.ACCEPTED:
            return <AcceptedIcon className="icon" />
        case Status.PENDING:
            return <PendingIcon className="icon" />
        case Status.REJECTED:
            return <RejectedIcon className="icon" />
        case Status.DROPPED:
            return <DroppedIcon className="icon" />

    }
}

export default StatusIcon