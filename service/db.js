// server database integration

// import mongoose

const mongoose = require('mongoose')

// connect server with mongo via mangoose

mongoose.connect('mongodb://localhost:27017/bank',{
    useNewUrlParser:true
})

// create model

const User = mongoose.model('User',{
    acno:Number,
    username:String,
    password:String,
    balance:Number,
    transaction:[]
})

module.exports={
    User
}