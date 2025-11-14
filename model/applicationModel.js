const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
    jobtitle:{
        type:String,
        required:true
    },
    joblocation:{
        type:String,
        required:true
    },
    fullname:{
        type:String,
        required:true
    },
    qualification:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    coverletter:{
        type:String,
        required:true
    },
    resume:{
        type:String,
        required:true
    },
})

const applications = mongoose.model("applications", applicationSchema)

module.exports = applications