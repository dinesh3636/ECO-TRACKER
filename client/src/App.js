import React from 'react';
import ComplexNavbar from './Components/Navbar/Navbar';
import {Rotes, Route, Routes} from "react-router-dom"
import Dashboard from "./Components/Pages/Dashboard/Dashboard"

import './App.css';

function App() {
  return (
    <>
    <ComplexNavbar />
    <Routes>
        <Route path="/dashboard" element={<Dashboard/>} />
        {/* <Route path="/profile" component={Profile} />
        <Route path="/settings" component={Settings} />
        <Route path="/billing" component={Billing} /> */}


</Routes>
    
    </>
  );
}

export default App;
