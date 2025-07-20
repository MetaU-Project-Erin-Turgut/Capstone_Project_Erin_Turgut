import "../styles/CompatibilityDisplay.css"

const CompatibilityDisplay = ({ compatibilityRatio }) => {
    //determine the color of the meter depending on how high the compatibility ratio is for better visual indication
    let meterColor = "";

    if (compatibilityRatio < .30) {
        meterColor = "red";
    } else if (compatibilityRatio < .60) {
        meterColor = "orange";
    } else {
        meterColor = "green";
    }

    return (
        <div className="compatibility-display" style={{'--meter-color': meterColor}}>
            <div className="compatibility-meter" style={{'--meter-angle': (compatibilityRatio * 360) + 'deg'}} />
            <p className="compatibility-desc"><span className="percentage-num">{Math.round(compatibilityRatio * 100)}%</span> match</p> 
        </div>
    )
}

export default CompatibilityDisplay;