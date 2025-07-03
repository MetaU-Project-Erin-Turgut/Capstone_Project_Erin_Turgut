import { useState, useEffect, Suspense } from 'react';
import InterestLevelColumn from "../components/InterestLevelColumn";
import APIUtils from "../utils/APIUtils";
import "../styles/InterestList.css";

const InterestList = () => {

    //array with level by array index and all interests at that level value as the value at that index
    const [interestsByLevel, setInterestsByLevel] = useState([]); 

    //fetch roots
    useEffect(() => {
        fetchRootInterests();
    }, []);

    const fetchRootInterests = async () => {
            try {
                const apiResultData = await APIUtils.fetchRootInterests();
                const newArr = []; 
                newArr[0] = apiResultData;
                setInterestsByLevel(newArr);
            } catch (error) {
                console.log("Status ", error.status);
                console.log("Error: ", error.message);
            }
        }

    const addNewColumn = async (interestId, clickedInterestLevel) => {
        try {
            const apiResultData = await APIUtils.fetchImmediateChildren(interestId);
            if (apiResultData.length !== 0) { //meaning no children i.e have reached leaf in the tree
                const newArr = [];
                for (let i = 0; i < clickedInterestLevel; i++) {
                    newArr[i] = interestsByLevel[i];
                }
                newArr[clickedInterestLevel] = apiResultData;
                setInterestsByLevel(newArr);
            } else {
                alert("No more subinterests!"); //will have better visual display for this later
            }
        } catch (error) {
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
    }

    return <div className="interest-list-container">
        <Suspense fallback={<p>Loading...</p>}>
            {interestsByLevel.map((interestsArr) => (
                <InterestLevelColumn 
                    key={interestsArr[0].id} //use first interest's id in level as level's key.
                    interests={interestsArr}
                    onInterestClick={addNewColumn}
                />
            ))}
        </Suspense>
    </div>
}

export default InterestList;