import preloader from "./assets/preloader.gif"

 function Preloader () {
    return(
        <div className="preloader-image-container">
<img
            src={preloader} 
            alt="Loading..."
            className="preloader-image"
          />
</div>
    )
}

export default Preloader