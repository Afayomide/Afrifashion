import { useState, useEffect, useRef } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/header/header';
import Home from './components/home/home';
import Females from './components/sections/females';
import Males from './components/sections/males';
import Fabrics from './components/sections/fabrics';
import Footer from './components/footer/footer';
import Signup from './components/forms/signup';
import Login from './components/forms/login';
import Cart from './components/cart/cart';
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { CartProvider } from './components/cartContext';
import ItemsInfo from './components/sections/itemsInfo';

import Sound from 'react-sound';
import AfroSounds from "./assets/afrosounds.mp3"


function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <CartProvider>
    <div className="App">
   <Header/>
   <div className="topmargin">
    <Routes >
   <Route element={<Home/>} path="/"/>
   <Route element={<Females/>} path="/femalestyles"/>
   <Route element={<Males/>} path="/malestyles"/>
   <Route element={<Fabrics/>} path="/fabrics"/>
   <Route element={<Signup/>} path="/signup"/>
   <Route element={<Login/>} path="/login"/>
   <Route element={<Cart/>} path="/cart"/>
   <Route element={<ItemsInfo/>} path='/:id'/>
   </Routes>  
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
    </CartProvider>
  );
}

export default App;
