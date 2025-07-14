import { useState, useEffect, Suspense } from 'react';
import InterestLevelColumn from "../components/InterestLevelColumn";
import APIUtils from "../utils/APIUtils";
import SelectedInterests from '../components/SelectedInterests';
import "../styles/InterestList.css";

const InterestList = () => {

    //2D array with level by array index and all interests at that level value as an array at that index
    const [interestsByLevel, setInterestsByLevel] = useState([]); 
    const [userInterests, setUserInterests] = useState(new Map());

    let initialUserInterests = null; //current solution to userInterests state not being set before fetchRootInterests - better solution?

    useEffect(() => {
        fetchUserInterests();
        fetchRootInterests();
    }, []);

    const fetchRootInterests = async () => {
        try {
            const apiResultData = await APIUtils.fetchRootInterests();
            for (let i = 0; i < apiResultData.length; i++) {
                if (initialUserInterests?.has(apiResultData.at(i).id)) {
                    apiResultData[i] = {...apiResultData[i], isSelected: true} // add isSelected field to interests also selected by user so that they will be displayed pre-checked
                }
            }
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

    const fetchUserInterests = async () => {
        try {
            const apiResultData = await APIUtils.fetchUserInterests();
            if (apiResultData.length >= 1) {
                initialUserInterests = new Map(
                    apiResultData.map(interest => [interest.id, interest.title])
                );
                setUserInterests(initialUserInterests);
            }
        } catch (error) {
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
    }

    const addNewColumn = async (interestId, clickedInterestLevel) => {
        try {
            const apiResultData = await APIUtils.fetchImmediateChildren(interestId);
            for (let i = 0; i < apiResultData.length; i++) {
                if (userInterests.has(apiResultData.at(i).id)) {
                    apiResultData[i] = {...apiResultData[i], isSelected: true}
                }
            }
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

    //this will update the selected interests in the database
    const submitSelectedInterests = async () => {
        const updatedInterests = {
            chosenInterests: Array.from(userInterests.entries()).map(([key, value]) => {
                return {id: key}
            })
        }
        
        try {
            await APIUtils.updateUserInterests(updatedInterests);
            await APIUtils.getNewGroupRecs();
            alert("New group recs! See Groups tab"); // TODO: Will have better visual display for this later
        } catch (error) {
            console.log("Status ", error.status);
            console.log("Error: ", error.message);
        }
        
    }

    return (<div className="interest-list-container">
        <SelectedInterests initialInterests={userInterests} onSubmitInterests={submitSelectedInterests}/>
        <div className="interest-list-columns-container">
        <Suspense fallback={<p>Loading...</p>}>
            {interestsByLevel.map((interestsArr) => (
                <InterestLevelColumn 
                    key={interestsArr.at(0).id} //use first interest's id in level as level's key.
                    interests={interestsArr}
                    onInterestClick={addNewColumn}
                    onUpdateInterests={(isNowSelected, interestId, interestTitle) => {
                        const newMap = new Map(userInterests);
                        if (isNowSelected) {
                            newMap.set(interestId, interestTitle);
                        } else {
                            newMap.delete(interestId);
                        }
                        setUserInterests(newMap); 
                    }}
                />
            ))}
        </Suspense>
        </div>
    </div>)
}

export default InterestList;