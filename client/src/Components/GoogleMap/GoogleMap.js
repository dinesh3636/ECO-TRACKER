import "./GoogleMap.css"
import React, { useEffect, useState } from 'react';import cycle from "../../assests/navicon/bicycle.png"
import bus from "../../assests/navicon/bus.png"
import walk from "../../assests/navicon/walk.png"
import sedan from "../../assests/navicon/sedan.png"
import train from "../../assests/navicon/train.png"
import bike from "../../assests/navicon/motorsport.png"
const GoogleMap = () => {
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBIbadEdJGrJDTiFtbsEQ1EW05hkw_OZig`;
        script.defer = true;
        script.async = true;

        script.onload = () => {
          initializeMap();
        };

        script.onerror = () => {
          console.error('Error loading Google Maps script.');
        };

        document.head.appendChild(script);

        return () => {
          document.head.removeChild(script);
        };
      }
    };

    const initializeMap = () => {
      // Initialize the map
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });

      // Add a marker
      const marker = new window.google.maps.Marker({
        position: { lat: -34.397, lng: 150.644 },
        map: map,
        title: 'My Marker',
      });

      // Add an info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: 'Hello, World!',
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    };

    loadGoogleMapsScript();
  }, []); // Empty dependency array to ensure this effect runs only once

  return (<>
        <div className='input-icon'>
        <div className='icons'>
    <img src={walk} />
    <img src={cycle} />
    <img src={bike} />
    <img src={sedan} />
    <img  src={bus} />
    <img src={train} />
    </div>
    </div>
    <div id="map" style={{ height: '400px' }}></div>
  </>
  );
};

export default GoogleMap;