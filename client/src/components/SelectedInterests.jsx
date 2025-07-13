import { Suspense } from 'react';
import "../styles/SelectedInterests.css";
import SingularSelectedInterest from './SingularSelectedInterest';

const SelectedInterests = ({ initialInterests, onSubmitInterests }) => {

    return (
        <>
            <h4>Your current interests:</h4>
            <div className="selected-interests-section">
                <Suspense fallback={<p>Loading...</p>}>
                    {Array.from(initialInterests.entries()).map( ([key, value]) => (
                        <SingularSelectedInterest key={key} interest={value}/>
                    ))}
                </Suspense>
                <button className="submit-changes-btn" onClick={onSubmitInterests}>Submit changes</button>
            </div>
            
        </>
    )
}

export default SelectedInterests;