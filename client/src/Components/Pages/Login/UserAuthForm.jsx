import React from 'react'
import { Link, Navigate } from "react-router-dom";
import InputBox from './InputBox'
import { useContext, useRef } from "react";
import axios from "axios";
import { storeInSession } from "../../common/session";
import { UserContext } from "../../../App.js";
import { Toaster, toast } from "react-hot-toast";


const UserAuthForm = ({ type }) => {

    let { userAuth: { access_token }, setUserAuth } = useContext(UserContext);
    const formElement = useRef(null);

    const userAuthThroughServer = (serverRoute, formData) => {
        console.log(process.env.REACT_APP_SERVER_DOMAIN + serverRoute);
        axios.post(process.env.REACT_APP_SERVER_DOMAIN + serverRoute, formData)
        .then(({ data }) => {
            storeInSession("user", JSON.stringify(data));
            setUserAuth(data)
        })
        .catch(({ response }) => {
            toast.error(response.data.error);
        })

    }

    const handleSubmit = (e) => {
        e.preventDefault(); // prevent form from submission
        
        let serverRoute = type == "sign-in" ? "/signin" : "/signup";

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

        // formdata
        let form = new FormData(formElement.current); // convert to form data from current tag (form)
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let {fullname, email, password} = formData;
        // validating data
        if (fullname && fullname.length < 3) {
            return toast.error("Fullname must be atleast 3 letters long")
        }
        if (!email.length) {
            return toast.error("Enter Email");
        }
        if (!emailRegex.test(email)) {
            return toast.error("Invalid Email");
        }
        if (!passwordRegex.test(password)) {
            return toast.error("Password should be 6 to 20 characters with a numeric, 1 lowercase and 1 uppercase letters");
        }

        userAuthThroughServer(serverRoute, formData);
    }


    return (
        access_token ? // if access token is present
        <Navigate to='/'/>
        :
        <section style={{ height: "100vh" }} className="flex items-center justify-center">
            <Toaster />
            <form ref={formElement} style={{ width: "80%", maxWidth: "400px" }}>
                <h1 style={{ fontSize: "2.5rem", fontFamily: "Gelasio", textTransform: "capitalize", textAlign: "center", marginBottom: "1.5rem" }}>
                    {type === "sign-in" ? "welcome back" : "join us today" }
                </h1>
                {
                    type !== "sign-in" &&
                    <InputBox name="fullname" type="text" placeholder="full name" icon="fi-rr-user"/>
                }
                <InputBox name="email" type="email" placeholder="email" icon="fi-rr-envelope"/>
                <InputBox name="password" type="password" placeholder="password" icon="fi-rr-key"/>
                <button style={{ backgroundColor: "#1a202c", color: "#fff", padding: "0.875rem 2rem", borderRadius: "0.75rem", border: "none", display: "block", margin: "2.25rem auto", fontSize: "1rem" }} type="submit" onClick={handleSubmit}>
                    { type.replace("-", " ") }
                </button>
                {
                    type === "sign-in" ?
                    <p style={{ marginTop: "1.5rem", color: "#4b5563", fontSize: "1rem", textAlign: "center" }}>
                        Don't have an account ?
                        <Link to="/signup" style={{ textDecoration: "underline", color: "#000", marginLeft: "0.25rem", fontSize: "1rem" }}>
                            Join us today.
                        </Link>
                    </p>
                    :
                    <p style={{ marginTop: "1.5rem", color: "#4b5563", fontSize: "1rem", textAlign: "center" }}>
                        Already a member ?
                        <Link to="/signin" style={{ textDecoration: "underline", color: "#000", marginLeft: "0.25rem", fontSize: "1rem" }}>
                            Sign in here.
                        </Link>
                    </p>
                }
            </form>
        </section>
    );
}

export default UserAuthForm;