import { useState } from 'react';
import '../styles/InterestTile.css';

const InterestTile = ({ interest, onTileClick, isSelectedInitially, onUpdateInterests }) => {

    const [isSelected, setIsSelected] = useState(isSelectedInitially);
    const handleCheckChange = (event) => {
        event.stopPropagation();
        onUpdateInterests(!isSelected, interest.id, interest.title)
        setIsSelected(prev => !prev)
    }

    return ( 
        <div className="interest-tile" onClick={() => {
                onTileClick(interest.id, interest.level);
                // TODO: add class to change shading
            }}>
            <p>{interest.title}</p>
            <input checked={isSelected} className="checkbox" type="checkbox" id={interest.id} name={interest.title} onClick={(event) => {
                handleCheckChange(event);
            }}/>
        </div>
    )
}

export default InterestTile;