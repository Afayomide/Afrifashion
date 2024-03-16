import { useEffect, useState } from "react";
import "./header.css"
import { BsFillTelephoneInboundFill } from "react-icons/bs";
import { BsCart } from "react-icons/bs";
import { CiMenuFries } from "react-icons/ci";
import { MdCancel } from "react-icons/md";
import { BsGenderMale } from "react-icons/bs";
import { BsGenderFemale } from "react-icons/bs";
import { GiRolledCloth } from "react-icons/gi";
import { Link, NavLink } from "react-router-dom";
import { GiAfrica } from "react-icons/gi";
import { useNavigate } from "react-router-dom";


function Header() {
  const navigate = useNavigate();
  const [displayNav, SetDisplayNav] = useState(false)
  const[authenticated, setAuthenticated] = useState()
  const [slideout, setSlideOut] = useState("")


  useEffect(() => {
  const Token = localStorage.getItem('authToken');

    if (Token) {
      console.log(Token)
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  });




   

    function  changeDisplay() {
            setSlideOut("links-slide-out")
             SetDisplayNav(!displayNav)
    }

  const handleLogout = () => {
    // Clear the token from localStorage (or sessionStorage)
    localStorage.removeItem('authToken');
    localStorage.removeItem("username")
    changeDisplay()
    setAuthenticated(false);
      navigate("/")
  };
    return(
     <header>
     {authenticated ? (<div>
      <nav className="big-screen-nav">

<div>
<NavLink   
className="h1-link" 
to="/">
   <h1>
       Cool Styles<GiAfrica/>
</h1>
</NavLink>

</div>

<div className="header-links">
<NavLink 
className={({ isActive, isPending }) =>
isActive ? "picked big-screen-link" : "big-screen-link"
}  
to="/femalestyles">
<BsGenderFemale/><p>Female Styles</p> 
</NavLink>

<NavLink className={({ isActive, isPending }) =>
isActive ? "picked big-screen-link" : "big-screen-link"
}  to="/malestyles" >
<BsGenderMale/><p>Male Styles</p>
</NavLink>

<NavLink className={({ isActive, isPending }) =>
isActive ? "picked big-screen-link" : "big-screen-link"
}  to="/fabrics">
<GiRolledCloth/><p>Fabrics</p>
</NavLink>

<NavLink className={({ isActive, isPending }) =>
isActive ? "picked big-screen-link" : "big-screen-link"
}  to="/contact">
<BsFillTelephoneInboundFill/><p>Contact Us </p>
</NavLink>
</div>

<div className="log-sign">
<NavLink className="cart-link" to="/cart">
<BsCart /><sup>0</sup>
</NavLink>

<p className= "big-screen-link" onClick={handleLogout}>Logout</p>
</div>
</nav>



<nav className="small-screen-nav">

<div className="h1-menu">
{displayNav ?<MdCancel className="menu" onClick={changeDisplay}/> : <CiMenuFries className="menu" onClick={changeDisplay}/> }

<NavLink className="h1-link" to="/">
<h1>
Cool Styles<GiAfrica/>
</h1>

</NavLink>

</div>


<NavLink className="cart-link" to="/cart">
<BsCart /><sup>0</sup>
</NavLink>
</nav>

<div className={`small-nav-links ${displayNav ? "show-nav" : 'hide-nav'}`}>
<NavLink className={({ isActive, isPending }) =>
isActive ? "picked nav-link" : `nav-link ${slideout}`
} onClick={changeDisplay}  to="/femalestyles" ><BsGenderFemale/><p>Female Styles</p></NavLink>
<NavLink className={({ isActive, isPending }) =>
isActive ? "picked nav-link" : `nav-link ${slideout}`
} onClick={changeDisplay}  to="/malestyles"><BsGenderMale/><p>Male Styles</p></NavLink>
<NavLink className={({ isActive, isPending }) =>
isActive ? "picked nav-link" : `nav-link ${slideout}`
} onClick={changeDisplay}  to="/fabrics"><GiRolledCloth/><p>Fabrics</p></NavLink>
<NavLink className={({ isActive, isPending }) =>
isActive ? "picked nav-link" : `nav-link ${slideout}`
} onClick={changeDisplay}  to="/contact"><p>Contact US</p></NavLink>
<button className="nav-link"  onClick={handleLogout}>Logout</button>

</div>
     </div>)
     
      : 
     
     (<div>
      <nav className="big-screen-nav">

<div>
<NavLink   
className="h1-link" 
to="/">
   <h1>
       Cool Styles<GiAfrica/>
</h1>
</NavLink>

</div>

<div className="header-links">
<NavLink 
className={({ isActive, isPending }) =>
isActive ? "picked big-screen-link" : "big-screen-link"
}  
to="/femalestyles">
<BsGenderFemale/><p>Female Styles</p> 
</NavLink>

<NavLink className={({ isActive, isPending }) =>
isActive ? "picked big-screen-link" : "big-screen-link"
}  to="/malestyles" >
<BsGenderMale/><p>Male Styles</p>
</NavLink>

<NavLink className={({ isActive, isPending }) =>
isActive ? "picked big-screen-link" : "big-screen-link"
}  to="/fabrics">
<GiRolledCloth/><p>Fabrics</p>
</NavLink>

<NavLink className={({ isActive, isPending }) =>
isActive ? "picked big-screen-link" : "big-screen-link"
}  to="/contact">
<BsFillTelephoneInboundFill/><p>Contact Us </p>
</NavLink>
</div>

<div className="log-sign">
<NavLink className="cart-link" to="/cart">
<BsCart /><sup>0</sup>
</NavLink>
{/*  */}
<NavLink className={({ isActive, isPending }) =>
isActive ? "picked big-screen-link" : "big-screen-link"
}  to="/signup" >Signup</NavLink>
<NavLink className={({ isActive, isPending }) =>
isActive ? "picked big-screen-link" : "big-screen-link"
}  to="/login" >Login</NavLink>
</div>
</nav>



<nav className="small-screen-nav">

<div className="h1-menu">
{displayNav ?<MdCancel className="menu" onClick={changeDisplay}/> : <CiMenuFries className="menu" onClick={changeDisplay}/> }

<NavLink className="h1-link" to="/">
<h1>
Cool Styles<GiAfrica/>
</h1>

</NavLink>

</div>


<NavLink className="cart-link" to="/cart">
<BsCart /><sup>0</sup>
</NavLink>
</nav>

<div className={`small-nav-links ${displayNav ? "show-nav" : 'hide-nav'}`}>
<NavLink className={({ isActive, isPending }) =>
isActive ? "picked nav-link" : `nav-link ${slideout}`
} onClick={changeDisplay}  to="/femalestyles" ><BsGenderFemale/><p>Female Styles</p></NavLink>
<NavLink className={({ isActive, isPending }) =>
isActive ? "picked nav-link" : `nav-link ${slideout}`
} onClick={changeDisplay}  to="/malestyles"><BsGenderMale/><p>Male Styles</p></NavLink>
<NavLink className={({ isActive, isPending }) =>
isActive ? "picked nav-link" : `nav-link ${slideout}`
} onClick={changeDisplay}  to="/fabrics"><GiRolledCloth/><p>Fabrics</p></NavLink>
<NavLink className={({ isActive, isPending }) =>
isActive ? "picked nav-link" : `nav-link ${slideout}`
} onClick={changeDisplay}  to="/contact"><p>Contact US</p></NavLink>
<NavLink className={({ isActive, isPending }) =>
isActive ? "picked nav-link" : `nav-link ${slideout}`
} onClick={changeDisplay}  to="/login"><p>Login</p></NavLink>
<NavLink className={({ isActive, isPending }) =>
isActive ? "picked nav-link" : `nav-link ${slideout}`
} onClick={changeDisplay}  to="/signup"><p>Signup</p></NavLink>
</div>
     </div>)}
    
     </header>
    )
}
export default Header