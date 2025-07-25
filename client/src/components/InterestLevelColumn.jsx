import { Suspense } from 'react';
import InterestTile from './InterestTile';
import '../styles/InterestLevelColumn.css';

//These are the vertical columns that hold all interests at a certain level
const InterestLevelColumn = ({ interests, onInterestClick, onUpdateInterests }) => {
    return (
    <div className="interest-column">
        <Suspense fallback={<p>Loading...</p>}>
            {interests.map((interest) => (
                <InterestTile key={interest.id} interest={interest} onTileClick={onInterestClick} isSelectedInitially={interest.isSelected} onUpdateInterests={onUpdateInterests}/>
            ))}
        </Suspense>
    </div>)
}

export default InterestLevelColumn;