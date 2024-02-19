import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  // State to track the current mode (light or dark)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Function to toggle between light and dark mode
  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  return (
    <div>
      <h1>Convert to Dark Mode</h1>
      <label className="switch">
        <input type="checkbox" checked={isDarkMode} onChange={toggleMode} />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default Settings;
