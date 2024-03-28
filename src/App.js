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
import { ProductProvider } from './components/productContext';
import ItemsInfo from './components/sections/itemsInfo';
import AboutUs from './components/aboutus/aboutus';
import SearchResults from './components/sections/searchResults';

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
    <Routes >
   <Route element={<Home/>} path="/"/>
   <Route element={<Females/>} path="/femalestyles"/>
   <Route element={<Males/>} path="/malestyles"/>
   <Route element={<Fabrics/>} path="/fabrics"/>
   <Route element={<Signup/>} path="/signup"/>
   <Route element={<Login/>} path="/login"/>
   <Route element={<Cart/>} path="/cart"/>
   <Route element={<AboutUs/>} path='/contact'/>
   <Route element={<ItemsInfo/>} path='/:id'/>
   <Route path="/search" element={<SearchResults/>} /> {/* Initial empty results */}
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
    </ProductProvider>
  );
}

export default App;
