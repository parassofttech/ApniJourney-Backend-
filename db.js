const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB is connected")
    }catch(err){
    console.log({message:"MongoDB is not connected ",error:err})
    }
}

module.exports = connectDB