import React, { useEffect } from 'react';

const GoogleMap = () => {
  useEffect(() => {
    // Load the Google Maps JavaScript API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBIbadEdJGrJDTiFtbsEQ1EW05hkw_OZig&callback=initMap`;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
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

    // Cleanup function to remove the script when the component is unmounted
    return () => {
      document.head.removeChild(script);
    };
  }, []); // Empty dependency array to ensure this effect runs only once

  return <div id="map" style={{ height: '400px' }}></div>;
};

export default GoogleMap;