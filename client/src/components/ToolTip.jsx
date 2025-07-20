import "../styles/ToolTip.css";

const ToolTip = ({ message, distanceFromIcon }) => {
    return <div className="tool-tip" style={{"--distance-from-icon": distanceFromIcon + "px"}}>
        <p>{message}</p>
    </div>
}

export default ToolTip;