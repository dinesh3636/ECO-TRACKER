import mongoose, { Schema } from "mongoose";

const CarpoolingSchema = new mongoose.Schema({
    carpooling_id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    model:{
        type: String,
        required: true,
    },
    seats:{
        type: Number,
        required: true,
    },
    pay:{
        type: Number,
        required:true,
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    origin:{
        type: String,
        required: true,

    },
    destination:{
        type: String,
        required:true,
    },
    seatsAvailable:{
        type: Number,
        required: true,
    },
    departureTime: {
        type: Date,
        required:true,
    },
    image:{
        type: String
    },
    joinedUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
},{
    timestamps: true
})
export default mongoose.model("Carpooling",CarpoolingSchema);