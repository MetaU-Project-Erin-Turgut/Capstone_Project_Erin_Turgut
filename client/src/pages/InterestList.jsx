import { useState, useEffect, Suspense } from 'react';
import InterestLevelColumn from "../components/InterestLevelColumn";
import APIUtils from "../utils/APIUtils";
import SelectedInterests from '../components/SelectedInterests';
import "../styles/InterestList.css";

const InterestList = () => {

    //2D array with level by array index and all interests at that level value as an array at that index
    const [interestsByLevel, setInterestsByLevel] = useState([]); 

    useEffect(() => {
        fetchRootInterests();
    }, []);

    const fetchRootInterests = async () => {
            try {
                const apiResultData = await APIUtils.fetchRootInterests();
                if (apiResultData.length >= 1) {
                    const newArr = []; 
                    newArr[0] = apiResultData; //make first level interests (stored in first index of array) hold all returned root interests
                    setInterestsByLevel(newArr);
                } else {
                    alert("Could not load interests"); // TODO: will have better visual display for this later
                }
            } catch (error) {
                console.log("Status ", error.status);
                console.log("Error: ", error.message);
            }
        }

    const addNewColumn = async (interestId, clickedInterestLevel) => {
        try {
            const apiResultData = await APIUtils.fetchImmediateChildren(interestId);
            if (apiResultData.length !== 0) { //have reached leaf in the tree therefore dont render more
                const newArr = [];
                for (let i = 0; i < clickedInterestLevel; i++) {
                    newArr[i] = interestsByLevel[i];
                }
                newArr[clickedInterestLevel] = apiResultData;
                setInterestsByLevel(newArr);
            } else {
                alert("No more subinterests!"); // TODO: will have better visual display for this later
            }
        } catch (error) {
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
    }

    return (<div className="interest-list-container">
        <SelectedInterests />
        <div className="interest-list-columns-container">
        <Suspense fallback={<p>Loading...</p>}>
            {interestsByLevel.map((interestsArr) => (
                <InterestLevelColumn 
                    key={interestsArr.at(0).id} //use first interest's id in level as level's key.
                    interests={interestsArr}
                    onInterestClick={addNewColumn}
                />
            ))}
        </Suspense>
        </div>
    </div>)
}

export default InterestList;