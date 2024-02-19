import React from 'react';
import ComplexNavbar from './Components/Navbar/Navbar';
import {Route, Routes} from "react-router-dom"
import Dashboard from "./Components/Pages/Dashboard/Dashboard"
import Profile from "./Components/Pages/Profile/Profile"
import Settings from './Components/Pages/Settings/Settings'
import Carpooling from './Components/Pages/Carpooling/Carpooling';
import GoogleMap from './Components/GoogleMap/GoogleMap';
import './App.css';

function App() {
  return (
    <>
    <ComplexNavbar />
    <Routes>
<<<<<<< HEAD
 
=======
        <Route path="/" element={<GoogleMap/>} />
>>>>>>> 38bf41a808095855e1f95fa6bce6fe9a21e25d00
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="/carpooling" element={<Carpooling/>} />
        
        



</Routes>
    
    </>
  );
}

export default App;
