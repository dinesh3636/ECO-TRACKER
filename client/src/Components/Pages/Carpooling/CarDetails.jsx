import React from 'react';
import './CarDetails.css'; // Import the CSS file for styling

// const CarDetails = ({ carpooling }) => {
// //   const { image, name, model, seats, payPerPerson } = car;

//   //console.log(carpooling)
//   return (
//     <div className="container">
//     <div className="car-details-container">
//       <p>{carpooling.author.personal_info.fullname} @{carpooling.author.personal_info.username}</p>
//       {/* <img src={carpooling.author.personal_info.profile_img} style={{
//           width: '50px', 
//           height: '50px',
//           borderRadius: '50%',
//           objectFit: 'cover'
//         }}  alt="" className="profile-image" /> */}
//       <img src={carpooling.image} style={{
//           width: '50px', /* Adjust the width and height to make it small */
//           height: '50px',
//           borderRadius: '50%', /* Make it a circle by setting border-radius to 50% */
//           objectFit: 'cover'
//         }} alt="" className="car-image" />
//       <div className="car-info">
//         <h2>name: {carpooling.name}</h2>
//         <p>Model: {carpooling.model}</p>
//         <p>Seats: {carpooling.seats}</p>
//         <p>Pay: {carpooling.pay}</p>
//         <p>Orgin:  {carpooling.origin}</p>
//         <p>destination: {carpooling.destination} </p>
//         <p>departureTime: {Date(carpooling.departureTime)} </p>
//         <p>seats available: {carpooling.seatsAvailable}</p>
//         <p>created At: {Date(carpooling.createdAt)}</p>
//       </div>
//       <div className="car-buttons">
//         <button className="view-details-button">View Details</button>
//         <button className="join-button">Join Pool</button>
//       </div>
//     </div>
//     </div>
//   );
// };


const CarDetails = ({ carpooling }) => {
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
        <button className="view-details-button">View Details</button>
        <button className="join-button">Join Pool</button>
      </div>
    </div>
  );
};


export default CarDetails;