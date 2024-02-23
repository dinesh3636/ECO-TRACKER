import "./CreateCarpooling.css";
import axios from "axios";
import React, { useContext, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import defaultCar from "./defaultCar.jpg"
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../App";

const CreateCarpooling = () => {
	
  let { userAuth: { access_token } } = useContext(UserContext);
  
  let { carpooling_id } = useParams();

	let navigate = useNavigate();

  const [carDetails, setCarDetails] = useState({
		name: "",
		model: "",
		seats: 0,
		pay: 0,
		origin: "",
		destination: "",
		seatsAvailable: 0,
		departureTime: "",
		image: "",
	});


	const convertToBase64 = (e) => {
		let img = e.target.files[0];
		if (img) {
			let loadingToast = toast.loading("Uploading...");
			var reader = new FileReader();

			// Resize or compress image before converting to base64
			// Example: Resize image to maximum width or height of 800 pixels
			const maxSize = 800;
			const canvas = document.createElement("canvas");
			const context = canvas.getContext("2d");
			const imgElement = new Image();

			imgElement.onload = () => {
				let width = imgElement.width;
				let height = imgElement.height;

				if (width > height) {
					if (width > maxSize) {
						height *= maxSize / width;
						width = maxSize;
					}
				} else {
					if (height > maxSize) {
						width *= maxSize / height;
						height = maxSize;
					}
				}

				canvas.width = width;
				canvas.height = height;
				context.drawImage(imgElement, 0, 0, width, height);

				// Convert the resized image to base64
				setCarDetails({ ...carDetails, image: canvas.toDataURL("image/jpeg") });

				toast.dismiss(loadingToast);
				toast.success("Uploaded !");
			};

			imgElement.src = URL.createObjectURL(img);
		}
	};

	const handleCreateCarpooling = (e) => {

    if (e.target.className.includes("disable")) {
			return ;
		}
		if (!carDetails.name.length){
      return toast.error("name should not be empty");
    }
    if (!carDetails.model.length){
      return toast.error("model should not be empty");
    }
    if (!carDetails.seats || carDetails.seats<=0){
        return toast.error("seats should not be negative or empty");
    }
    if (!carDetails.pay || carDetails.pay<=0){
        return toast.error("pay should not be negative or empty");
    }
    if (!carDetails.origin.length){
        return toast.error("origin should not be empty");
    }
    if (!carDetails.destination.length){
        return toast.error("destination should not be empty");
    }
    if (!carDetails.seatsAvailable || carDetails.seatsAvailable > carDetails.seats){
        return toast.error("available seats should be in bounds");
    }
    if (!carDetails.departureTime){
        return toast.error("departureTime should not be empty");
    }
    if (!carDetails.image.length){
        return toast.error("name should not be empty");
    }

    let loadingToast = toast.loading("Creating...");

    e.target.classList.add('disable');

    axios.post(process.env.REACT_APP_SERVER_DOMAIN + "/post-carpooling", { ...carDetails, id: carpooling_id }, {
			headers: {
				"Authorization": `Bearer ${access_token}`
			}
		})
    .then(() => {
			e.target.classList.remove('disable');
			toast.dismiss(loadingToast);
			toast.success("Created Successfully");

			setTimeout(() => {
				navigate("/Carpooling"); // to navigate back to home page after publishing
			}, 500);

		})
		.catch(({ response, message }) => {
			e.target.classList.remove('disable');
			toast.dismiss(loadingToast);

			if (response)
				return toast.error(response.data.error); // to access the error from data sent from the backend
			return toast.error(message);
		})

  };


	return (
		<div style={{ marginTop: "20px" }}>
      <Toaster />
			<div className="create-carpooling-container">
				<h2>Create Carpooling</h2>
				<div className="input-container">
					<label htmlFor="name">Car Name:</label>
					<input
						type="text"
						name="name"
						value={carDetails.name}
						onChange={(e) =>
							setCarDetails({ ...carDetails, name: e.target.value })
						}
					/>
				</div>
				<div className="input-container">
					<label htmlFor="model">Car Model:</label>
					<input
						type="text"
						name="model"
						value={carDetails.model}
						onChange={(e) =>
							setCarDetails({ ...carDetails, model: e.target.value })
						}
					/>
				</div>
				<div className="input-container">
					<label htmlFor="seats">Seats:</label>
					<input
						type="number"
						name="seats"
						value={carDetails.seats}
						onChange={(e) =>
							setCarDetails({ ...carDetails, seats: e.target.value })
						}
					/>
				</div>
				<div className="input-container">
					<label htmlFor="payPerPerson">Pay (in rupees):</label>
					<input
						type="number"
						name="payPerPerson"
						value={carDetails.pay}
						onChange={(e) =>
							setCarDetails({ ...carDetails, pay: e.target.value })
						}
					/>
				</div>
				<div className="input-container">
					<label htmlFor="origin">Origin:</label>
					<input
						type="text"
						name="origin"
						value={carDetails.origin}
						onChange={(e) =>
							setCarDetails({ ...carDetails, origin: e.target.value })
						}
					/>
				</div>
				<div className="input-container">
					<label htmlFor="destination">Destination:</label>
					<input
						type="text"
						name="destination"
						value={carDetails.destination}
						onChange={(e) =>
							setCarDetails({ ...carDetails, destination: e.target.value })
						}
					/>
				</div>
				<div className="input-container">
					<label htmlFor="seatsAvailable">Seats Available:</label>
					<input
						type="number"
						name="seatsAvailable"
						value={carDetails.seatsAvailable}
						onChange={(e) =>
							setCarDetails({ ...carDetails, seatsAvailable: e.target.value })
						}
					/>
				</div>
				<div className="input-container">
					<label htmlFor="departureTime">departure Time:</label>
					<input
						type="datetime-local"
						name="departureTime"
						value={carDetails.departureTime}
						onChange={(e) =>
							setCarDetails({ ...carDetails, departureTime: e.target.value })
						}
					/>
				</div>
				<div className="input-container">
        <label htmlFor="image">
					<img src={carDetails.image ? carDetails.image : defaultCar} alt="carpooling image" />
					<input
            id="image"
						name="image"
						onChange={convertToBase64}
						type="file"
            accept=".png, .jpg, .jpeg" 
            hidden
					/>
        </label>
				</div>
				<button
					onClick={handleCreateCarpooling}
					className="create-carpooling-button"
				>
					Create Carpooling
				</button>
			</div>
		</div>
	);
};

export default CreateCarpooling;
