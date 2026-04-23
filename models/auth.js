const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required: true
    },
    blocked: { type: Boolean, default: false },
     emailVerified: {
        type: Boolean,
        default: false
    },
    otp:String,
    otpExpire: {
  type: Date,
},
}, { timestamps: true });


const userModel = mongoose.model("users",userSchema)
module.exports = userModel;