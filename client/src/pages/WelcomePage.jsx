import Header from "../components/Header";
import "../styles/WelcomePage.css"

//This is the page that loads on start up - welcoming user to the app
const WelcomePage = () => {

    return (
        <>
            <Header />
            <div className="welcome-div">
                <div className="welcome-title">
                    <h1 className="caprasimo-regular">Pivot</h1>
                    <h2>A social app that gets rid of the hardest part: 
                        <br></br>the first step.
                    </h2>
                </div>

                <div className="welcome-images">
                    <h2>(Placeholder images go here)</h2>
                </div>
            </div>
        </>
    )
}

export default WelcomePage;