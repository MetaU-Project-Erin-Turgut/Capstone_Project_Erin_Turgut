import "../styles/DropDownBar.css";

const ProfileDropDown = ({onProfileNav, onLogout}) => {
    return (<div className="dropdown-bar profile-dropdown">
        <div className="bar-tab" onClick={onProfileNav}>My profile</div>
        <div className="bar-tab" onClick={onLogout}>Logout</div>
    </div>)
}

export default ProfileDropDown;