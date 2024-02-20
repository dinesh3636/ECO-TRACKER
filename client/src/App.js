import React from 'react';
import ComplexNavbar from './Components/Navbar/Navbar';
import {Route, Routes} from "react-router-dom"
import { createContext, useEffect, useState } from "react";
import Dashboard from "./Components/Pages/Dashboard/Dashboard"
import Profile from "./Components/Pages/Profile/Profile"
import Settings from './Components/Pages/Settings/Settings'
import Carpooling from './Components/Pages/Carpooling/Carpooling';
import GoogleMap from './Components/GoogleMap/GoogleMap';
import './App.css';
// import Register from './Components/Pages/Register/Register';
// import Login from './Components/Pages/Login/Login';
import UserAuthForm from './Components/Pages/Login/UserAuthForm';

import { lookInSession } from './Components/common/session';

export const UserContext = createContext({});

function App() {

  const [userAuth, setUserAuth] = useState({});

    useEffect(() => {
        let userInSession = lookInSession("user");

        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null })
    }, []);

  return (
    <>
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <ComplexNavbar />
      <Routes> 
          <Route path="/" element={<GoogleMap/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/settings" element={<Settings/>} />
          <Route path="/carpooling" element={<Carpooling/>} />
          <Route path="/signin" element={<UserAuthForm type="sign-in"/>} />
          <Route path="/signup" element={<UserAuthForm type="sign-up"/>} />
      </Routes>
    </UserContext.Provider>
    
    </>
  );
}

export default App;
