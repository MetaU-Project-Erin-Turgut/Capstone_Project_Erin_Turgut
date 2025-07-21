import { IoAccessibility } from "react-icons/io5";
import "../styles/LoadingPage.css"

const LoadingPage = () => {
    return (
        <div className="overlay">
            <div className="loading-icons">
                <IoAccessibility className="person"/>
                <IoAccessibility className="person"/>
                <IoAccessibility className="person"/>
            </div>
            <h2 className="loading-message">Loading...</h2>
        </div>
    )
}

export default LoadingPage;