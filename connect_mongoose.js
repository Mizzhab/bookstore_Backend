//import mongoose
const mongoose = require('mongoose')

const connectionstring = process.env.DATABASE // accessing the environment variable

mongoose.connect(connectionstring).then(()=>{//connect method return a promise
    console.log('mongodb connected successfully');// if positive response
}).catch((err)=>{
    console.log(`mongodb connection failed due to :${err}`)// if negative response
})