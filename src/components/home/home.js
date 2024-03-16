import { Link } from "react-router-dom"
import "./home.css"
import bgImage from "../../assets/fabricsbg.jpeg"

function Home () {
    return(
        <div className="home-container">
        <img className="home-bg-image" src={bgImage} alt="backgroundImage"/>
        <div className="home-links">
                <Link to="/femalestyles" className="home-link">Shop Women</Link>
     <Link to="/malestyles" className="home-link">Shop Men</Link>
     <Link to="/fabrics" className="home-link">Shop Fabrics</Link> 
        </div>

        </div>
    )
}

export default Home