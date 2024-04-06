import { useEffect, useState, useContext } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import "./home.css"
import bgImage from "../../assets/fabricsbg.jpeg"
import asooke from "../../assets/asooke.jpg"
import { ProductContext } from "../productContext"



function Home () {
    const [lace, setLace ] = useState([])
    const [asoOke, setAsoOke] = useState([])
    const { cartNo, setCartNo, setShouldFetchCart,mainLoading, setMainLoading, setLocalCartLength, cartList, setCartList } = useContext(ProductContext);
    const [error, setError] = useState(null); 
    const [dansiki, setDansiki] = useState([])
    const [ankara, setAnkara] = useState([])
    const [gele, setGele] = useState([])


    const handleAddToCart = async (fabric) => {
        const storedCartList = JSON.parse(localStorage.getItem('localCartList')) || [];
          const fabricWithQuantity = { ...fabric, newquantity: 1 }; // Add newQuantity field with default value 1
          storedCartList.push(fabricWithQuantity);
          localStorage.setItem('localCartList', JSON.stringify(storedCartList));
          console.log('Added fabric to local cart:', fabric);
      
          setLocalCartLength(storedCartList.length);
          setCartNo(storedCartList.length)
      
          const token = localStorage.getItem("authToken");
      
          if (token){
        try {
       
      
          const token = localStorage.getItem("authToken");
          if (token) {}
          const headers = {
            Authorization: `Bearer ${token}`,
          };
      
          if (!token) {
            throw new Error("User not authenticated");
          }
      
          const productId = fabric._id;
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/cart/add`,
            { productId }, 
            { headers }
          );
      
          console.log('Added fabric to server cart:', response.data);
        } catch (error) {
          console.error('Error adding to cart:', error);
          setError('An error occurred while adding to cart.');
      
          const updatedCartList = storedCartList.filter(item => item._id !== fabric._id);
          localStorage.setItem('localCartList', JSON.stringify(updatedCartList));
          console.log('Removed fabric from local cart:', fabric);
        } finally {
          setShouldFetchCart(true); 
        }
      }
      };

function Card (props){
return(
              <div className="home-product-list"  key={props._id}>   
               <Link className="home-product-link" to={`/${props._id}`}>   
                <img src={props.image} alt={props.name} />
                <div className="home-product-link-texts">
                  <p><span>Type:</span>{props.type}</p>  
                   <p>{props.description}</p>
                   <p><span>Qty:</span>{props.quantity} yards</p>
                   <p><span>Price:</span>{props.price} per yard</p>
                </div>
                 </Link>      
        
                 {cartList.some((cartItem) => cartItem._id === props._id) || (JSON.parse(localStorage.getItem('localCartList')) || []).some((storedCartItem) => storedCartItem._id === props._id) ? (
    <button className="home-cart-button already-in-cart">Added To Cart</button>
) : (
    <button className="home-cart-button add-to-cart" onClick={() => handleAddToCart(props)}>Add to Cart</button>
)}</div>         
)
}
    useEffect(() => {
        const token = localStorage.getItem("authToken")
        const fetchData = async () => {
          try { 
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/clothespreview`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },            
            });
        const fiveItems = response.data.previewData
          console.log(response.data.previewData)
          setAsoOke(fiveItems.asoOke)
          setLace(fiveItems.lace)
          setDansiki(fiveItems.dansiki)
          setGele(fiveItems.gele)
          setAnkara(fiveItems.ankara)
    }
    catch{}
}
fetchData()
}, [])
     
    return(
        <div className="home-container">
        <img className="home-bg-image" src={bgImage} alt="backgroundImage"/>
        <div className="home-links">
                {/* <Link to="/femalestyles" className="home-link">Shop Women</Link>
     <Link to="/malestyles" className="home-link">Shop Men</Link> */}   
       <Link to="/fabrics" className="home-link">All Fabrics</Link> 
        <div>     
        <div className="home-fabric-section">
                <h3><Link className="home-section-link" to="/search?q=aso%20oke">Ankara</Link></h3>
                <div className="home-product-list-container">
                  {ankara.map(Card)}  
                </div> 
                <p><Link className="home-see-all-link">See all Aso Oke.....</Link></p>
            </div>     
            <div className="home-fabric-section">
                <h3><Link className="home-section-link" to="/search?q=aso%20oke">Aso Oke(Top Cloth)</Link></h3>
                <div className="home-product-list-container">
                  {asoOke.map(Card)}  
                </div> 
                <p><Link className="home-see-all-link">See all Aso Oke.....</Link></p>
            </div>
            <div className="home-fabric-section">
                <h3><Link  className="home-section-link" to="/search?q=aso%20oke">Dansiki</Link></h3>  
                <div className="home-product-list-container">
                  {dansiki.map(Card)}  
                </div> 
                <p><Link className="home-see-all-link">See all dansiki.....</Link></p>    
            </div>
            <div className="home-fabric-section">
                <h3><Link className="home-section-link" to="/search?q=aso%20oke">Gele</Link></h3>
                <div className="home-product-list-container">
                  {gele.map(Card)}  
                </div> 
                <p><Link className="home-see-all-link">See all gele.....</Link></p>    
            </div>

            <div className="home-fabric-section">
                <h3><Link className="home-section-link" to="/search?q=lace">Lace</Link></h3>
                <div className="home-product-list-container">
                  {lace.map(Card)}  
                </div>
                <p><Link className="home-see-all-link">See all lace.....</Link></p>    
            </div>

            {/* <div className="home-fabric-section">
                <h3><Link className="home-section-link" to="/search?q=aso%20oke">Bogolanfini</Link></h3>
            </div>
            <div className="home-fabric-section">
                <h3><Link className="home-section-link" to="/search?q=aso%20oke">Kente</Link></h3>
            </div>
            <div className="home-fabric-section">
                <h3><Link className="home-section-link" to="/search?q=aso%20oke">Senufo CLoth</Link></h3>
            </div>
            <div className="home-fabric-section">
                <h3><Link className="home-section-link" to="/search?q=aso%20oke">Shweshwe</Link></h3>
            </div> */}
        </div>
        </div>

        </div>
    )
}

export default Home