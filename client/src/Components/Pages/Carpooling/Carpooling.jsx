import React, { useEffect, useState } from "react";
import "./Carpooling.css";
import { MenuItem, ListItemIcon } from "@mui/material";
import view from "../../../assests/navicon/view.png";
import post from "../../../assests/navicon/post.png";
import { Link } from "react-router-dom";
import CarDetails from "./CarDetails";
import axios from "axios";
import Loader from "../../common/Loader";
import NoDataMessage from "../../common/NoDataMessage";




const Carpooling = () => {

	const [ carpoolings, setCarpoolings ] = useState(null);

	const fetchCarpoolings = () => {

		axios.get(process.env.REACT_APP_SERVER_DOMAIN + "/carpooling")
		.then(data => {
			// console.log(data.data.carpoolings);
			setCarpoolings(data.data.carpoolings);
		})
		.catch(err => {
			console.log(err.message);
		})
	}

	useEffect(() => {
        fetchCarpoolings();
    }, []);

	return (
		<>
			<div className="carpooling">
				<MenuItem to="/postcarpooling" component={Link}>
					<ListItemIcon>
						<img src={post} alt="Help" width={26} height={26} />
					</ListItemIcon>
					Create Carpooling
				</MenuItem>
			</div>
			<div className="cont">
			<div className="car-deatils">
			{/* {console.log(carpoolings)} */}
			{
				carpoolings==null ? (
				<Loader />
				) : (
				
				carpoolings.length ? 
					carpoolings.map((carpooling, index) => {
					return <CarDetails key={index} carpooling={carpooling} />
					})
				: <NoDataMessage message="No Cars Available"/>
				)
            }
			</div>
			</div>
		</>
	);
};

export default Carpooling;
