import { useState, useEffect } from "react";
import { useNotification } from '../contexts/NotificationContext';
import APIUtils from "../utils/APIUtils";
import NavBar from "../components/NavBar"
import InputField from "../components/InputField";
import { DEFAULT_FORM_VALUE, FormFieldPlaceholders } from "../utils/utils";
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
            setMessage("Changes saved!")
        } catch (error) {
            setMessage(error.message)
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
        
    }

    return (
        <div id="profile-page">
            <NavBar isMenuVisible={false}/>
            <div className="page-header"><h2>Your Profile</h2></div>
            <div className="profile-info">
                <section className="image-side">
                    <FaUserCircle className="profile-page-img"/>
                </section>
                <form className="info-section">

                    {Object.keys(formData).map((formField) => {
                        return (
                            <div key={formField}>
                                <h3 className="input-label">{FormFieldPlaceholders[formField]}:</h3>
                                {!isEdit ? <p>{formData[formField]}</p> :
                                <InputField 
                                    placeholder={formData[formField]}
                                    name={formField}
                                    value={formData[formField]}
                                    onChange={handleInputChange}
                                />}
                            </div>
                        )
                    })}
        
                    {isEdit ? <div className="save-btn" onClick={handleFormSubmit}><FaRegSave className="icon"/></div> : 
                    <div className="edit-btn" onClick={() => {setIsEdit(true)}}><GrEdit className="icon"/></div>}
                </form>
            </div>
        </div>
    )
}

export default ProfilePage;