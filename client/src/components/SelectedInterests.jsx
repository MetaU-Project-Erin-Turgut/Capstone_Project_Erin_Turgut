import { Suspense } from 'react';
import "../styles/SelectedInterests.css";
import SingularSelectedInterest from './SingularSelectedInterest';

const SelectedInterests = ({ initialInterests, onUpdateInterests, onDeleteSelectedInterest }) => {

    return (
        <>
            <h4>Your current interests:</h4>
            <div className="selected-interests-section">
                <Suspense fallback={<p>Loading...</p>}>
                    {Array.from(initialInterests.entries()).map( ([key, value]) => (
                        <SingularSelectedInterest key={key} interest={value} onDeleteSelectedInterest={onDeleteSelectedInterest}/>
                    ))}
                </Suspense>
                <button className="submit-changes-btn" onClick={onUpdateInterests}>Submit changes</button>
            </div>
            
        </>
    )
}

export default SelectedInterests;