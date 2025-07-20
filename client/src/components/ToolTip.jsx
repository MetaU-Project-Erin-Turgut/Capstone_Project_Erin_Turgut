import "../styles/ToolTip.css";

const ToolTip = ({ message }) => {
    return <div className="tool-tip">
        <p>{message}</p>
    </div>
}

export default ToolTip;