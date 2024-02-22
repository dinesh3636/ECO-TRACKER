import mongoose from "mongoose";
const CarpoolingScheema = new mongoose.Schema({
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
        type: String,
        required:true,
    },
    orgin:{
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
    depatureTime: {
        type: String,
        required:true,
    },
    photo:{
        type:Buffer,
        contentType: String,
    },
},{
    timestamps:true
})
export default mongoose.model("CarpoolingScheema",CarpoolingScheema);
