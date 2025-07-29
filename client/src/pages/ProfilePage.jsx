import { useState, useEffect } from "react";
import { useNotification } from '../contexts/NotificationContext';
import APIUtils from "../utils/APIUtils";
import NavBar from "../components/NavBar"
import { DEFAULT_FORM_VALUE } from "../utils/utils";
import { FaUserCircle } from "react-icons/fa";
import { GrEdit } from "react-icons/gr";
import { FaRegSave } from "react-icons/fa";
import "../styles/ProfilePage.css";

const ProfilePage = () => {

    const { setMessage } = useNotification(); //used to control notification pop up and message

    const [formData, setFormData] = useState(DEFAULT_FORM_VALUE);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const apiResultData = await APIUtils.fetchUserInfo();
            setFormData({
                firstName: apiResultData.userProfile.firstName,
                lastName: apiResultData.userProfile.lastName,
                address: apiResultData.address,
                username: apiResultData.username,
                email: apiResultData.email
            })
        } catch (error) {
            setMessage(error.message)
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleFormSubmit = async () => {
        //update user info in database

        try {
            const apiResultData = await APIUtils.updateUserInfo(formData);
            setFormData({
                firstName: apiResultData.userProfile.firstName,
                lastName: apiResultData.userProfile.lastName,
                address: apiResultData.address,
                username: apiResultData.username,
                email: apiResultData.email
            })
            setIsEdit(false)
        } catch (error) {
            setMessage(error.message)
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
        
    }

    return (
        <div id="profile-page">
            <NavBar isMenuVisible={false}/>
            <div className="page-header"><h2>Profile Page</h2></div>
            <div className="profile-info">
                <section className="image-side">
                    <FaUserCircle className="profile-page-img"/>
                </section>
                <form className="info-section">
                    {/* combine these? */}
                    <h3 className="input-label">First name:</h3>
                    {!isEdit ? <p>{formData.firstName}</p> :
                    <input className="profile-input"
                            placeholder={formData.firstName}
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}/>}
                    <h3 className="input-label">Last name:</h3>
                    {!isEdit ? <p>{formData.lastName}</p> :
                    <input className="profile-input"
                            placeholder={formData.lastName}
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}/>}
                    <h3 className="input-label">Username:</h3>
                    {!isEdit ? <p>{formData.username}</p> :
                    <input className="profile-input"
                            placeholder={formData.username}
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}/>}
                    <h3 className="input-label">Email:</h3>
                    {!isEdit ? <p>{formData.email}</p> :
                    <input className="profile-input"
                            placeholder={formData.email}
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}/>}
                    <h3 className="input-label">Address:</h3>
                    {!isEdit ? <p>{formData.address}</p> :
                    <input className="profile-input"
                            placeholder={formData.address}
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}/>}
                    {isEdit ? <div className="save-btn" onClick={handleFormSubmit}><FaRegSave className="icon"/></div> : 
                    <div className="edit-btn" onClick={() => {setIsEdit(true)}}><GrEdit className="icon"/></div>}
                </form>
            </div>
        </div>
    )
}

export default ProfilePage;