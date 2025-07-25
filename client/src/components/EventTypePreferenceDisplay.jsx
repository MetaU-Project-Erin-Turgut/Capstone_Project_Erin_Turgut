import { Suspense } from 'react';
import { EventTypeArr, EventTypePreferenceColors } from "../utils/utils";
import "../styles/EventTypePreferenceDisplay.css";

const EventTypePreferenceDisplay = ({ eventTypeTotals }) => {

    const colors = Object.values(EventTypePreferenceColors);

    let cumulativeTotals = 0;
    for (let i = 0; i < eventTypeTotals.length; i++) {
        cumulativeTotals += Number(eventTypeTotals[i])
    }

    const eventTypeAngles = eventTypeTotals.map((eventTypeTotal) => {
        if (cumulativeTotals == 0) return 90;
        return (eventTypeTotal/cumulativeTotals) * 360;
    })

    let passedStyling = colors[0] + " " + 0 + 'deg,' + colors[0] + " " + eventTypeAngles[0].toString() + 'deg,';
    
    let prevAngle = eventTypeAngles[0];
    for (let i = 1; i < eventTypeAngles.length; i++) {
        passedStyling += colors[i] + " " + prevAngle.toString() + 'deg,';
        passedStyling += colors[i] + " " + (prevAngle + eventTypeAngles[i]).toString() + 'deg,';
        prevAngle  = prevAngle + eventTypeAngles[i];
    }
    passedStyling = passedStyling.substring(0, passedStyling.length - 1);


    return (
        <div className="event-type-display">
            <div className="event-type-pie-chart" style={{'--calculated-conic-gradient': passedStyling}}></div>
            <div className="event-type-legend">
                <Suspense fallback={<p>Loading legend...</p>}>
                    {eventTypeTotals.map((eventTypeTotal, index) => (
                        <p className="event-type-key" key={eventTypeTotal + index} style={{'--text-color': colors[index]}}>{EventTypeArr.at(index)}</p>
                    ))}
                </Suspense>
            </div>
        </div>
    )
}

export default EventTypePreferenceDisplay;