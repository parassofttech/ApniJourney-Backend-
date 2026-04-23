const mongoose = require ("mongoose")

let contactSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    
    email:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
})

let contactModel = mongoose.model("contact",contactSchema)

module.exports = contactModel