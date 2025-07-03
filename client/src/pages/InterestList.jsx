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
                const newArr = [...interestsByLevel];
                newArr[0] = apiResultData;
                setInterestsByLevel(newArr);
            } catch (error) {
                console.log("Status ", error.status);
                console.log("Error: ", error.message);
            }
        }

    const addNewColumn = () => {
        //call setInterestsByLevel => increase by 1 new pair with fetched values

    }

    return <div className="interest-list-container">
        <Suspense fallback={<p>Loading...</p>}>
            {interestsByLevel.map((interestsArr, index) => (
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