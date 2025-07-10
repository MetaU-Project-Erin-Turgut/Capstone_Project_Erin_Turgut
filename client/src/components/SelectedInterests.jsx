import { Suspense } from 'react';
import "../styles/SelectedInterests.css";

const SelectedInterests = ({ userInterests }) => {
    return (
        <>
            <h4>Your current interests:</h4>
            <div className="selected-interests-section">
                <Suspense fallback={<p>Loading...</p>}>
                    {userInterests.map((interest) => (
                        <p key={interest.id}>{interest.title}, </p> 
                    ))}
                </Suspense>
            </div>
        </>
    )
}

export default SelectedInterests;