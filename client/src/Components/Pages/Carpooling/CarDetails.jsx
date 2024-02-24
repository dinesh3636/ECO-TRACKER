import React, { useState } from 'react';
import './CarDetails.css'; // Import the CSS file for styling



const CarDetails = ({ carpooling }) => {

  const [ status, setStatus ] = useState("Join Now");

  const handleStatusChange = () => {
    if (status == "Join Now")
      setStatus("Leave Now")
    else 
      setStatus("Join Now")
  }

  return (
    <div className="car-details-container">
    <div className="author-info">
      <img src={carpooling.author.personal_info.profile_img} className="profile-image" alt="Profile" />
      <p>{carpooling.author.personal_info.fullname} @{carpooling.author.personal_info.username}</p>
    </div>
    <div className="car-image-container">
      <img src={carpooling.image} className="car-image" alt="Car" />
    </div>
    <div className="car-info">
      <h2>{carpooling.name}</h2>
      <p>Model: {carpooling.model}</p>
      <p>Seats: {carpooling.seats}</p>
      <p>Pay: {carpooling.pay}</p>
      <p>Origin:  {carpooling.origin}</p>
      <p>Destination: {carpooling.destination}</p>
      <p>Departure Time: {new Date(carpooling.departureTime).toLocaleString()}</p>
      <p>Seats Available: {carpooling.seatsAvailable}</p>
      <p>Created At: {new Date(carpooling.createdAt).toLocaleString()}</p>
    </div>
    <div className="car-buttons">
      <button className="join-button" onClick={handleStatusChange}>{status}</button>
    </div>
  </div>
);
};


export default CarDetails;