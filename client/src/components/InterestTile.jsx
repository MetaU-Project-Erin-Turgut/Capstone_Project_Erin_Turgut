import '../styles/InterestTile.css';

const InterestTile = ({ interest, onTileClick }) => {
    return ( 
        <div className="interest-tile" onClick={() => {
                onTileClick(interest.id, interest.level);
                //add class to change shading
            }}>
            <p>{interest.title}</p>
        </div>
    )
}

export default InterestTile;