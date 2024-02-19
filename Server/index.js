import express from "express";
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import 'dotenv/config';
import bcrypt from "bcrypt"; // encryt password
import { nanoid } from "nanoid"; // generate random number for username
import jwt from "jsonwebtoken";
import cors from "cors";

// schema imports

import User from "./Schema/User.js";

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

mongoose.connect(process.env.MONGO_URI, {
    autoIndex: true
});

const formatDataToSend = (user) => {
    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY)

    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname,
    }
}

const generateUsername = async (email) => {
    let username = email.split("@")[0];
    let isUsernameNotUnique = await User.exists({"personal_info.username": username}).then((result) => result)
    isUsernameNotUnique ? username += nanoid().substring(0, 5) : "";
    return username;
}

app.post("/signup", (req, res) => {

    let {fullname, email, password} = req.body;
    // validating data from front end
    if (fullname.length < 3) {
        return res.status(403).json({"error": "Fullname must be atleast 3 letters long"})
    }
    if (!email.length) {
        return res.status(403).json({"error": "Enter Email"});
    }
    if (!emailRegex.test(email)) {
        return res.status(403).json({"error": "Invalid Email"});
    }
    if (!passwordRegex.test(password)) {
        return res.status(403).json({"error": "Password should be 6 to 20 characters with a numeric, 1 lowercase and 1 uppercase letters"});
    }

    bcrypt.hash(password, 10, async (err, hashed_password) => {
        
        let username = await generateUsername(email);

        let user = new User({
            personal_info: { fullname, email, password: hashed_password, username }
        })

        user.save().then((u) => {
            return res.status(200).json(formatDataToSend(u))
        })
        .catch(err => {
            if (err.code == 11000) { // duplication error
                return res.status(500).json({"error": "Email already exists"})
            }
            return res.status(500).json({"error": err.message})
        });
    })

})

app.post("/signin", (req, res) => {
    let { email, password } = req.body;
    User.findOne({ "personal_info.email": email })
    .then((user) => {
        if (!user) {
            return res.status(403).json({ "error": "Email not found" })
        }
        
        if (!user.google_auth) {
            bcrypt.compare(password, user.personal_info.password, (err, result) => {
                if (err) {
                    return res.status(403).json({ "error": "Error Occured while login, please try again" });
                }
                if (!result) { // incorrect password
                    return res.status(403).json({ "error": "Incorrect Password" });
                } else {
                    return res.status(200).json(formatDataToSend(user))
                }
            })
        } else {
            return res.status(403).json({ "error": "Account was already created with google" })
        }
        
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({ "error": err.message })
    })
})

/*
// Import API routes and middleware
const apiRoutes = require('./routes/api');
const databaseMiddleware = require('./middleware/database');


// Define the API routes
app.use('/api', apiRoutes);

// Apply the database middleware to all routes
app.use(databaseMiddleware);
*/


// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});