import "../styles/Notification.css";

const NOTIFICATION_TIME = 3000; //in milliseconds

const Notification = ({ message, onDropDown }) => {
    setTimeout(onDropDown, 3000)
    return (
        <div className="notif-popup" style={{'--notif-time': NOTIFICATION_TIME / 1000 + 's'}}>{message}</div>
    )
}

export default Notification;