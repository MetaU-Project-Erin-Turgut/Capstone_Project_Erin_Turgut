import "../styles/SingularSelectedInterest.css";
const SingularSelectedInterest = ({interest, onDeleteSelectedInterest }) => {
    return (
        <div className="selected-interest">
            <p>{interest}</p>
            <button onClick={onDeleteSelectedInterest}>X</button>
        </div>
    )
}

export default SingularSelectedInterest;