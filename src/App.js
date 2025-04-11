import { useState, useRef } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { ProductProvider } from "./components/productContext";
import { CurrencyProvider } from "./components/currency/currencyContext";
import Footer from "./components/footer/footer";
import Header from "./components/header/header";
import AfroSounds from "./assets/afrosounds.mp3";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


axios.defaults.withCredentials = true;


function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const queryClient = new QueryClient();


  return (
        <QueryClientProvider client={queryClient}>
    <ProductProvider>
      <CurrencyProvider>
      <div className="App">
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            className: "",
            duration: 5000,
            style: {
              background: "#ffd79f",
              color: "#00000",
            },
          }}
        />
        <Header />
        <div className="topmargin">
          <Outlet />
        </div>
        <div className="sound">
          <audio ref={audioRef} src={AfroSounds} />
          <div className="playmusic" onClick={togglePlayPause}>
            {isPlaying ? (
              <FaPause className="playmusic" />
            ) : (
              <FaPlay className="playmusic" />
            )}
          </div>
        </div>

        <Footer />
      </div>    
      </CurrencyProvider>
    </ProductProvider>
    </QueryClientProvider>
  );
}

export default App;
