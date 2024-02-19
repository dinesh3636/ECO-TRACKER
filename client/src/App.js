import React from 'react';
import ComplexNavbar from './Components/Navbar/Navbar';
import {Route, Routes} from "react-router-dom"
import Dashboard from "./Components/Pages/Dashboard/Dashboard"
import Profile from "./Components/Pages/Profile/Profile"
import Settings from './Components/Pages/Settings/Settings'
import Carpooling from './Components/Pages/Carpooling/Carpooling';
import './App.css';

function App() {
  return (
    <>
    <ComplexNavbar />
    <Routes>
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="/carpooling" element={<Carpooling/>} />



</Routes>
    
    </>
  );
}

export default App;
