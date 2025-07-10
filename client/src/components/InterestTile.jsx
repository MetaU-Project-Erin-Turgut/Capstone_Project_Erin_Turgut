import '../styles/InterestTile.css';

const InterestTile = ({ interest, onTileClick }) => {
    return ( 
        <div className="interest-tile" onClick={() => {
                onTileClick(interest.id, interest.level);
                // TODO: add class to change shading
            }}>
            <p>{interest.title}</p>
            <input className="checkbox" type="checkbox" id={interest.id} name={interest.id} onClick={(event) => {event.stopPropagation()}}/>
        </div>
    )
}

export default InterestTile;