
import React, { useState } from "react"
import { useEffect } from "react"
import { useContext } from "react"
import { Link } from "react-router-dom"

export var cartList = []
export let uniqueArray = []


 

function removeDuplicates(books) { 


    var jsonObject = books.map(JSON.stringify);
    var uniqueSet = new Set(jsonObject);
    uniqueArray = Array.from(uniqueSet).map(JSON.parse);
    console.log(uniqueArray);
    
}

function Cards(props){



  const {items} = useContext(ItemContext)
  const {cart,setCart} = useContext(CartContext)
    const{id,size,imgsrc,price,name} = props
const [add, setAdd] = useState("Add to Cart")
const [change, setChanger] = useState("")
const [loading, setLoading] = useState(true);



 

   const addToCart = (props) => {
    setAdd("Added")
    
        setCart([props])         
        console.log([props])
      cartList.push(props, ...items)
         removeDuplicates(cartList)
    localStorage.setItem('item', JSON.stringify(uniqueArray)); 
    }



 useEffect(() => {
  const imageLoader = new Image();
  imageLoader.src = imgsrc;
  imageLoader.onload = () => setLoading(false);
}, [imgsrc]);

    return(
        <FadeInSection key={id}>
        <div className="clothes-container">
        <Link className="clothes-link " to={`/${id}`}> 
        {loading ?     (
          <div className="loader-container">
          <div className="spinner"></div>
      </div>) :
           <img alt={id} src={imgsrc} loading="lazy"/>}
           </Link>
           <div className="link-button-container">
        <div className="link-button">

           <div>
            <p>size: <span className="size">{size}</span></p>
            <p>₦{price}</p>
           </div> 
            
           <div>
           <button className="add-to-cart-button" onClick={() => addToCart(props)}>{add}</button>
           </div>

        </div>
        <p className="clothes-name">{name}</p>
        </div>
  
        </div>
        </FadeInSection>
    )
}

export default Cards