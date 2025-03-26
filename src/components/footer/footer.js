import "./footer.css"
import { GiCrown } from "react-icons/gi";
import { title } from "../globalPhrases";


export default function Footer () {
    return(
        <footer>
            <div className="footer-container">
           <h3>{title}<GiCrown className="crown"/></h3>
         
            </div>
        </footer>
    )
}
