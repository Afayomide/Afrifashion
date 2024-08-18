import { useState, useEffect, useRef } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Outlet } from 'react-router-dom';
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { ProductProvider } from './components/productContext';
import Footer from './components/footer/footer';
import Header from './components/header/header';
import Sound from 'react-sound';
import AfroSounds from "./assets/afrosounds.mp3"


 function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <ProductProvider>
    <div className="App">
   <Header/>
   <div className="topmargin">
<Outlet/>
   </div>
   <div className="sound">
   <Sound
        url={AfroSounds}
        playStatus={isPlaying ? Sound.status.PLAYING : Sound.status.PAUSED}
        ref={audioRef}
      />
       </div>
       <div onClick={togglePlay}>
  {
        !isPlaying ? <FaPlay   className='playmusic'/> : <FaPause className='playmusic'/>
       }
       </div>
     
 
   <Footer/>
    </div>
    </ProductProvider>
  );
}

export default App;
