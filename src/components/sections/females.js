export default function Females () {
   const Token = localStorage.getItem("authToken")
    return (
        <div className="margin-top">
        {Token ? (<div> Logged in </div>): "logged out"}
        </div>
       
    )
}