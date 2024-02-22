import React from 'react';
import './CarDetails.css'; // Import the CSS file for styling

const CarDetails = () => {
//   const { image, name, model, seats, payPerPerson } = car;

  return (
    <div className="container">
    <div className="car-details-container">
      <img src="" alt="" className="car-image" />
      <div className="car-info">
        <h2>name</h2>
        <p>Model: </p>
        <p>Seats: </p>
        <p>Pay Per Person: </p>
        <p>Orgin    -      destination </p>
        <p>seats avilable</p>
      </div>
      <div className="car-buttons">
        <button className="view-details-button">View Details</button>
        <button className="join-button">Join Pool</button>
      </div>
    </div>
    </div>
  );
};

export default CarDetails;