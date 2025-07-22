import { RiGroup2Fill } from "react-icons/ri";
import "../styles/LoadingPage.css"

const LoadingPage = () => {
    return (
        <div className="overlay">
            <div className="loading-icons">
                <RiGroup2Fill className="group-icon"/>
            </div>
            <h2 className="loading-message">Loading...</h2>
        </div>
    )
}

export default LoadingPage;