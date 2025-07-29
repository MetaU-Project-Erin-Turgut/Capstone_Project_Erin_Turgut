import { useState, useEffect } from "react";
import APIUtils from "../utils/APIUtils";
import NavBar from "../components/NavBar"
import { DEFAULT_FORM_VALUE } from "../utils/utils";

const ProfilePage = () => {

    const [formData, setFormData] = useState(DEFAULT_FORM_VALUE);

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
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
    }

    return (
        <div id="profile-page">
            <NavBar isMenuVisible={false}/>
            <div className="page-header"><h2>Profile Page</h2></div>
            <h3>First name:</h3>
            <p>{formData.firstName}</p>
            <h3>Last name:</h3>
            <p>{formData.lastName}</p>
            <h3>Username:</h3>
            <p>{formData.username}</p>
            <h3>Email:</h3>
            <p>{formData.email}</p>
            <h3>Address:</h3>
            <p>{formData.address}</p>
        </div>
    )
}

export default ProfilePage;