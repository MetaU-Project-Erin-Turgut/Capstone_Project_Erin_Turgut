import '../styles/InterestTile.css';

const InterestTile = ({ interest, onTileClick }) => {

    const handleCheck = (event) => {
        event.stopPropagation()
    }

    return ( 
        <div className="interest-tile" onClick={() => {
                onTileClick(interest.id, interest.level);
                // TODO: add class to change shading
            }}>
            <p>{interest.title}</p>
            <input className="checkbox" type="checkbox" id={interest.id} name={interest.title} onClick={(event) => {handleCheck(event)}}/>
        </div>
    )
}

export default InterestTile;