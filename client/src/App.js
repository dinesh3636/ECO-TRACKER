import React from 'react';
import ComplexNavbar from './Components/Navbar/Navbar';
import {Route, Routes} from "react-router-dom"
import Dashboard from "./Components/Pages/Dashboard/Dashboard"
import Profile from "./Components/Pages/Profile/Profile"
import Settings from './Components/Pages/Settings/Settings'
import Carpooling from './Components/Pages/Carpooling/Carpooling';
import GoogleMap from './Components/GoogleMap/GoogleMap';
import './App.css';
import Register from './Components/Pages/Register/Register';
import Login from './Components/Pages/Login/Login';

function App() {
  return (
    <>
    <ComplexNavbar />
    <Routes>
        <Route path="/" element={<GoogleMap/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="/carpooling" element={<Carpooling/>} />
        <Route path="/signup" element={<Register/>} />
        <Route path="/signin" element={<Login/>} />
</Routes>
    
    </>
  );
}

export default App;
