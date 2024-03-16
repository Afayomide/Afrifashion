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

function App() {
  return (
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
   </Routes>  
   </div>
 
   <Footer/>
    </div>
  );
}

export default App;
