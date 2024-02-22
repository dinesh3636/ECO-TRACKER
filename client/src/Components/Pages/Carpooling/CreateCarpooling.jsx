import "./CreateCarpooling.css"
import axios from "axios";
import React, { useState } from 'react';

const CreateCarpooling = ({ onCreateCarpooling }) => {
  const [carDetails, setCarDetails] = useState({
    name: '',
    model: '',
    seats: '',
    payPerPerson: '',
    origin: '',
    destination: '',
    seatsAvailable: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value,type } = e.target;
    setCarDetails((prevDetails) => ({
        ...prevDetails,
        [name]: type === 'file' ? e.target.files[0] : value,
      }));
  };

  const handleCreateCarpooling = async () => {
    try {
      const formData = new FormData();

      // Append each key-value pair to the formData object
      for (const key in carDetails) {
        formData.append(key, carDetails[key]);
      }

      // Send the form data to the backend
      await axios.post('/carpooling', formData);

      // Handle success or navigate to a success page
      console.log('Carpooling created successfully');
    } catch (error) {
      console.error('Error creating carpooling:', error);
      // Handle error
    }
  };

  return (
    <div style={{marginTop:'20px'}}>
    <div className="create-carpooling-container">
      <h2>Create Carpooling</h2>
      <div className="input-container">
        <label htmlFor="name">Car Name:</label>
        <input type="text" name="name" value={carDetails.name} onChange={handleChange} />
      </div>
      <div className="input-container">
        <label htmlFor="model">Car Model:</label>
        <input type="text" name="model" value={carDetails.model} onChange={handleChange} />
      </div>
      <div className="input-container">
        <label htmlFor="seats">Seats:</label>
        <input type="number" name="seats" value={carDetails.seats} onChange={handleChange} />
      </div>
      <div className="input-container">
        <label htmlFor="payPerPerson">Pay Per Person:</label>
        <input type="number" name="payPerPerson" value={carDetails.payPerPerson} onChange={handleChange} />
      </div>
      <div className="input-container">
        <label htmlFor="origin">Origin:</label>
        <input type="text" name="origin" value={carDetails.origin} onChange={handleChange} />
      </div>
      <div className="input-container">
        <label htmlFor="destination">Destination:</label>
        <input type="text" name="destination" value={carDetails.destination} onChange={handleChange} />
      </div>
      <div className="input-container">
        <label htmlFor="seatsAvailable">Seats Available:</label>
        <input type="number" name="seatsAvailable" value={carDetails.seatsAvailable} onChange={handleChange} />
      </div>
      <button onClick={handleCreateCarpooling} className="create-carpooling-button">
        Create Carpooling
      </button>
    </div>
    </div>
  );
};

export default CreateCarpooling;