import React from 'react';
import ComplexNavbar from './Components/Navbar/Navbar';
import {Router, Route} from "react-router-dom"
import Dashboard from '@mui/icons-material/Dashboard';
import './App.css';

function App() {
  return (
    <>
    <ComplexNavbar />
    {/* <Router>
      <Switch>
        <Route path="/profile" component={Profile} />
        <Route path="/notification" component={Notification} />
        <Route path="/settings" component={Settings} />
        <Route path="/billing" component={Billing} />
        <Route path="/" component={Dashboard} />
      </Switch>
    </Router> */}
    
    </>
  );
}

export default App;
