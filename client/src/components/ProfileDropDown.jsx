import "../styles/ProfileDropDown.css";

const ProfileDropDown = ({onProfileNav, onLogout}) => {
    return (<div className="profile-dropdown">
        <div className="profile-dropdown-option" onClick={onProfileNav}>My profile</div>
        <div className="profile-dropdown-option" onClick={onLogout}>Logout</div>
    </div>)
}

export default ProfileDropDown;